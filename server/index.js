const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const Tesseract = require('tesseract.js');
const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const sharp = require('sharp');
const { addRecipe, getAllRecipes, migrateFromJsonIfNeeded, removeRecipe, removeRecipes, updateRecipe, getAllRestaurants, addRestaurant, updateRestaurant, removeRestaurant, getAllFoodTypes, addFoodType, updateFoodType, removeFoodType, getAllTags, addTag, ensureTag, removeTag } = require('./db');
const { chromium } = require('playwright');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limit: stricter in production; more permissive in dev to avoid 429 on reload
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 2000,
  message: { error: 'Too many requests; please try again later.' },
  standardHeaders: true
});
app.use('/api', apiLimiter);

app.use(cors());
app.use(bodyParser.json());

// Reject URLs that point at private/local hosts (SSRF protection)
function isUrlSafeForFetch(urlString) {
  try {
    const u = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    const host = (u.hostname || '').toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') return false;
    if (/^10\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || /^192\.168\./.test(host)) return false;
    if (host.endsWith('.local')) return false;
    return true;
  } catch {
    return false;
  }
}

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const upload = multer({
  limits: { fileSize: MAX_FILE_SIZE },
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = file.mimetype === 'application/pdf' ? '.pdf' : (path.extname(file.originalname || '') || '.bin');
      cb(null, uuidv4() + ext);
    }
  })
});

const RECIPES_FILE = path.join(__dirname, 'recipes.json');
migrateFromJsonIfNeeded(RECIPES_FILE);

const extractInstructionsFromText = (lines) => {
  if (!lines || lines.length === 0) return [];

  const cleanedLines = lines
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (cleanedLines.length === 0) return [];

  const instructionsStartIndex = cleanedLines.findIndex((line) =>
    /^(instructions|directions|method|steps?)$/i.test(line)
  );

  const relevantLines = instructionsStartIndex >= 0
    ? cleanedLines.slice(instructionsStartIndex + 1)
    : cleanedLines;

  const bulletPattern = /^(\d+[\).]|[-*•])\s+/;
  const numberedSteps = relevantLines.filter((line) => bulletPattern.test(line));

  if (numberedSteps.length > 0) {
    return numberedSteps
      .map((line) => line.replace(bulletPattern, '').trim())
      .filter(Boolean);
  }

  const joined = relevantLines.join(' ');
  return joined
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
};

const extractInstructionsFromMarkdown = (text) => {
  if (!text) return [];
  const lines = text.split('\n').map((line) => line.trim());
  const headingRegex = /^#{2,6}\s+/;
  const instructionHeadingRegex = /^#{2,6}\s+(instructions?|directions?|method|steps?|how to make|how-to)$/i;
  const bulletPattern = /^(\d+[\).]|[-*•])\s+/;

  const findSectionAfterHeading = () => {
    const idx = lines.findIndex((line) => instructionHeadingRegex.test(line));
    if (idx === -1) return [];
    const sectionLines = [];
    for (let i = idx + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (headingRegex.test(line)) break;
      if (line.length > 0) sectionLines.push(line);
    }
    return sectionLines;
  };

  const extractStepsFromLines = (sectionLines) => {
    if (!sectionLines || sectionLines.length === 0) return [];
    const numberedSteps = sectionLines.filter((line) => bulletPattern.test(line));
    if (numberedSteps.length > 0) {
      return numberedSteps
        .map((line) => line.replace(bulletPattern, '').trim())
        .filter(Boolean);
    }
    const joined = sectionLines.join(' ');
    return joined
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  };

  const sectionLines = findSectionAfterHeading();
  const sectionSteps = extractStepsFromLines(sectionLines);
  if (sectionSteps.length > 0) return sectionSteps;

  // Fallback: find the longest list block in the markdown.
  const listBlocks = [];
  let current = [];
  for (const line of lines) {
    if (bulletPattern.test(line)) {
      current.push(line);
      continue;
    }
    if (current.length > 0) {
      listBlocks.push(current);
      current = [];
    }
  }
  if (current.length > 0) listBlocks.push(current);

  if (listBlocks.length === 0) return [];
  const longest = listBlocks.reduce((best, block) => (block.length > best.length ? block : best), listBlocks[0]);
  if (longest.length < 3) return [];

  return longest
    .map((line) => line.replace(bulletPattern, '').trim())
    .filter(Boolean);
};

const extractTitleFromMarkdown = (text) => {
  if (!text) return '';
  const firstHeading = text.split('\n').find((line) => /^#\s+/.test(line));
  return firstHeading ? firstHeading.replace(/^#\s+/, '').trim() : '';
};

const extractIngredientsFromMarkdown = (text) => {
  if (!text) return [];
  const lines = text.split('\n').map((line) => line.trim());
  const headingRegex = /^#{2,6}\s+/;
  const ingredientHeadingRegex = /^#{2,6}\s+(ingredients?)$/i;
  const bulletPattern = /^(\d+[\).]|[-*•])\s+/;
  const idx = lines.findIndex((line) => ingredientHeadingRegex.test(line));
  if (idx === -1) return [];
  const collected = [];
  for (let i = idx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (headingRegex.test(line)) break;
    if (!line) continue;
    const trimmed = line.replace(bulletPattern, '').trim();
    if (trimmed && trimmed.length < 200) collected.push(trimmed);
  }
  return collected;
};

const fetchViaJinaReader = async (url) => {
  const normalized = url.replace(/^https?:\/\//, '');
  const readerUrl = `https://r.jina.ai/http://${normalized}`;
  const response = await axios.get(readerUrl, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/plain'
    },
    validateStatus: (status) => status >= 200 && status < 500
  });

  if (response.status >= 400) {
    throw new Error(`Jina Reader returned ${response.status}`);
  }

  const markdown = typeof response.data === 'string' ? response.data : '';
  const title = extractTitleFromMarkdown(markdown);
  const instructions = normalizeInstructions(extractInstructionsFromMarkdown(markdown));
  const ingredients = extractIngredientsFromMarkdown(markdown);

  return { title, instructions, ingredients: ingredients || [] };
};

const parseRecipeFromHtml = (html, url) => {
  const $ = cheerio.load(html);

  let title = $('meta[property="og:title"]').attr('content') ||
              $('h1').first().text() ||
              $('title').text() ||
              'Unknown Recipe';
  let instructions = [];
  let ingredients = [];

  const ldJsonScripts = $('script[type="application/ld+json"]');
  ldJsonScripts.each((i, script) => {
      try {
          const data = JSON.parse($(script).html());
          const graph = data['@graph'] || (Array.isArray(data) ? data : [data]);
          const recipe = graph.find(item => {
              const type = item['@type'];
              return type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
          });
          if (recipe) {
              if (recipe.name) title = recipe.name;

              if (recipe.recipeIngredient && Array.isArray(recipe.recipeIngredient)) {
                  ingredients = recipe.recipeIngredient.map((ing) => (typeof ing === 'string' ? ing : (ing.name || String(ing))).trim()).filter(Boolean);
              }

              if (recipe.recipeInstructions) {
                  if (Array.isArray(recipe.recipeInstructions)) {
                      instructions = recipe.recipeInstructions.map(step => {
                          if (typeof step === 'string') return step;
                          if (step.text) return step.text;
                          if (step.itemListElement) {
                              return step.itemListElement.map(s => s.text || s).join('\n');
                          }
                          return JSON.stringify(step);
                      });
                  } else if (typeof recipe.recipeInstructions === 'string') {
                      instructions = [recipe.recipeInstructions];
                  }
              }
              return false;
          }
      } catch (e) {
          // ignore
      }
  });

  if (ingredients.length === 0) {
      $('.recipe-ingredients, .ingredients, [class*="ingredient"]').each((i, el) => {
          $(el).find('li').each((j, li) => {
              const text = $(li).text().trim();
              if (text && text.length < 200) ingredients.push(text);
          });
      });
  }

  if (instructions.length === 0) {
      $('.recipe-instructions, .instructions, .recipe-steps, .steps, [class*="instruction"], [class*="step"]').each((i, el) => {
          $(el).find('li').each((j, li) => {
              const text = $(li).text().trim();
              if (text) instructions.push(text);
          });
          if (instructions.length === 0) {
              const text = $(el).text().trim();
              if (text) instructions.push(text);
          }
      });
  }

  return {
    title: title.trim(),
    url,
    type: 'General',
    instructions: normalizeInstructions(instructions),
    ingredients: ingredients || []
  };
};

const fetchWithPlaywright = async (url) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    const html = await page.content();
    return parseRecipeFromHtml(html, url);
  } finally {
    await browser.close();
  }
};

/** Fetch raw HTML with Playwright (bypasses many bot blocks). */
const fetchHtmlWithPlaywright = async (url) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    return await page.content();
  } finally {
    await browser.close();
  }
};

const normalizeInstructions = (instructions) => {
  if (!Array.isArray(instructions)) return [];
  const normalized = instructions.flatMap((step) => {
    if (!step) return [];
    const text = String(step).trim();
    if (!text) return [];
    if (text.includes('\n')) {
      return text.split('\n').map((line) => line.trim()).filter(Boolean);
    }
    return [text];
  });

  return normalized
    .map((step) => step.replace(/^\s*(\d+[\).]|[-*•])\s+/, '').trim())
    .filter(Boolean);
};

// Routes
app.get('/api/recipes', (req, res) => {
  res.json(getAllRecipes());
});

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags.map((t) => String(t).trim()).filter(Boolean);
};

app.get('/api/tags', (req, res) => {
  res.json(getAllTags());
});

app.post('/api/tags', (req, res) => {
  const { name } = req.body;
  const n = (name || '').trim();
  if (!n) return res.status(400).json({ error: 'Tag name is required' });
  const tag = addTag(n);
  res.status(201).json(tag);
});

app.delete('/api/tags/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Id is required' });
  const removed = removeTag(id);
  if (!removed) return res.status(404).json({ error: 'Tag not found' });
  res.status(204).send();
});

app.post('/api/recipes', (req, res) => {
  const { title, url, screenshot, pdfPath, type, rawText, instructions, ingredients, foodType, tags } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const tagNames = normalizeTags(tags || []);
  tagNames.forEach(ensureTag);

  const recipe = {
    id: uuidv4(),
    title,
    url,
    screenshot,
    pdfPath: pdfPath || null,
    type: type || 'General',
    rawText,
    instructions: normalizeInstructions(instructions || []),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
    tags: tagNames,
    dateAdded: new Date().toISOString()
  };

  addRecipe(recipe);
  res.status(201).json(recipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, screenshot, pdfPath, type, rawText, instructions, ingredients, dateAdded, foodType, tags } = req.body;
  if (!id) return res.status(400).json({ error: 'Recipe id is required' });
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const tagNames = normalizeTags(tags || []);
  tagNames.forEach(ensureTag);

  const recipe = {
    id,
    title,
    url,
    screenshot,
    pdfPath: pdfPath || null,
    type: type || 'General',
    rawText,
    instructions: normalizeInstructions(instructions || []),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
    tags: tagNames,
    dateAdded: dateAdded || new Date().toISOString()
  };

  const updated = updateRecipe(recipe);
  if (!updated) return res.status(404).json({ error: 'Recipe not found' });

  res.json(recipe);
});

app.delete('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Recipe id is required' });

  const removed = removeRecipe(id);
  if (!removed) return res.status(404).json({ error: 'Recipe not found' });

  res.status(204).send();
});

app.post('/api/recipes/bulk-delete', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids must be a non-empty array' });
  }

  const removed = removeRecipes(ids);
  res.json({ removed });
});

// Restaurants
app.get('/api/restaurants', (req, res) => {
  res.json(getAllRestaurants());
});

app.get('/api/site-images', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl || !rawUrl.trim()) {
    return res.status(400).json({ error: 'url query parameter is required' });
  }
  const pageUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  if (!isUrlSafeForFetch(pageUrl)) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  const extractImagesFromHtml = (html, baseUrl) => {
    const base = new URL(baseUrl);
    const resolve = (href) => {
      if (!href || !href.trim()) return null;
      try {
        return new URL(href, base).href;
      } catch {
        return null;
      }
    };
    const $ = cheerio.load(html);
    const seen = new Set();
    const images = [];
    const add = (url, type) => {
      const u = resolve(url);
      if (u && !seen.has(u)) {
        seen.add(u);
        images.push({ url: u, type });
      }
    };
    $('meta[property="og:image"]').each((_, el) => add($(el).attr('content'), 'og'));
    $('meta[name="twitter:image"]').each((_, el) => add($(el).attr('content'), 'twitter'));
    $('link[rel*="icon"]').each((_, el) => add($(el).attr('href'), 'icon'));
    $('img[src]').each((_, el) => {
      if (images.length >= 25) return false;
      add($(el).attr('src'), 'img');
    });
    return images;
  };

  try {
    let html = null;
    let response;
    try {
      response = await axios.get(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 10000,
        validateStatus: (s) => s >= 200 && s < 400
      });
      html = response.data;
    } catch (axiosErr) {
      const status = axiosErr.response && axiosErr.response.status;
      if (status === 403 || status === 429) {
        console.log(`site-images: ${pageUrl} returned ${status}, trying Playwright`);
        try {
          html = await fetchHtmlWithPlaywright(pageUrl);
        } catch (pwErr) {
          console.error('site-images Playwright fallback failed:', pwErr.message);
          return res.status(403).json({
            error: 'This site blocked the request. You can paste an image URL above or upload a photo instead.'
          });
        }
      } else {
        throw axiosErr;
      }
    }

    if (typeof html !== 'string') {
      return res.status(500).json({ error: 'Could not fetch page' });
    }
    const images = extractImagesFromHtml(html, pageUrl);
    res.json({ images });
  } catch (err) {
    console.error('site-images error:', err.message);
    res.status(500).json({ error: 'Could not fetch page: ' + (err.message || 'Unknown error') });
  }
});

app.post('/api/restaurants', (req, res) => {
  const { name, orderingUrl, mainUrl, iconUrl, iconBgLight, iconBg, foodType, tags } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Restaurant name is required' });
  }
  const tagNames = normalizeTags(tags || []);
  tagNames.forEach(ensureTag);
  const resolvedIconBg = iconBg != null && iconBg !== '' ? String(iconBg) : (iconBgLight === false || iconBgLight === 0 ? 'dark' : 'light');
  const restaurant = {
    id: uuidv4(),
    name: name.trim(),
    orderingUrl: orderingUrl && orderingUrl.trim() ? orderingUrl.trim() : null,
    mainUrl: mainUrl && mainUrl.trim() ? mainUrl.trim() : null,
    iconUrl: iconUrl && iconUrl.trim() ? iconUrl.trim() : null,
    iconBg: resolvedIconBg,
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
    tags: tagNames,
    dateAdded: new Date().toISOString()
  };
  addRestaurant(restaurant);
  res.status(201).json(restaurant);
});

app.put('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const { name, orderingUrl, mainUrl, iconUrl, iconBgLight, iconBg, foodType, tags } = req.body;
  if (!id) return res.status(400).json({ error: 'Restaurant id is required' });
  if (!name || !name.trim()) return res.status(400).json({ error: 'Restaurant name is required' });
  const tagNames = normalizeTags(tags || []);
  tagNames.forEach(ensureTag);
  const resolvedIconBg = iconBg != null && iconBg !== '' ? String(iconBg) : (iconBgLight === false || iconBgLight === 0 ? 'dark' : 'light');
  const restaurant = {
    id,
    name: name.trim(),
    orderingUrl: orderingUrl && orderingUrl.trim() ? orderingUrl.trim() : null,
    mainUrl: mainUrl && mainUrl.trim() ? mainUrl.trim() : null,
    iconUrl: iconUrl && iconUrl.trim() ? iconUrl.trim() : null,
    iconBg: resolvedIconBg,
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
    tags: tagNames,
    dateAdded: req.body.dateAdded || new Date().toISOString()
  };
  const updated = updateRestaurant(restaurant);
  if (!updated) return res.status(404).json({ error: 'Restaurant not found' });
  res.json(restaurant);
});

app.delete('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Restaurant id is required' });
  const removed = removeRestaurant(id);
  if (!removed) return res.status(404).json({ error: 'Restaurant not found' });
  res.status(204).send();
});

// Food types (for recipes and to-go)
app.get('/api/food-types', (req, res) => {
  res.json(getAllFoodTypes());
});

app.post('/api/food-types', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
  const type = addFoodType(name.trim());
  res.status(201).json(type);
});

app.put('/api/food-types/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id) return res.status(400).json({ error: 'Id is required' });
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
  const updated = updateFoodType(id, name.trim());
  if (!updated) return res.status(404).json({ error: 'Food type not found' });
  res.json({ id, name: name.trim() });
});

app.delete('/api/food-types/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Id is required' });
  const removed = removeFoodType(id);
  if (!removed) return res.status(404).json({ error: 'Food type not found' });
  res.status(204).send();
});

app.post('/api/recipes/preview/url', async (req, res) => {
  const { url } = req.body;
  if (!url || !url.trim()) return res.status(400).json({ error: 'URL is required' });
  if (!isUrlSafeForFetch(url)) return res.status(400).json({ error: 'URL not allowed' });
  console.log(`Attempting to scrape URL: ${url}`);
  try {
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.google.com/',
          'DNT': '1',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-User': '?1'
        },
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 500
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Got 403, trying fallback title extraction from body');
        response = error.response;
      } else {
        throw error;
      }
    }

    const parsed = parseRecipeFromHtml(response.data, url);

    const isBlocked = parsed.title.toLowerCase().includes('just a moment') || parsed.title.toLowerCase().includes('cloudflare') || response.status === 403;
    if (isBlocked || parsed.instructions.length === 0) {
        try {
          const playwrightResult = await fetchWithPlaywright(url);
          if (playwrightResult.instructions && playwrightResult.instructions.length > 0) {
            return res.json(playwrightResult);
          }
        } catch (playwrightError) {
          console.error('Playwright fetch failed:', playwrightError.message);
        }

        try {
          const jinaResult = await fetchViaJinaReader(url);
          return res.json({
            title: jinaResult.title || parsed.title.trim(),
            url: url,
            type: 'General',
            instructions: jinaResult.instructions || [],
            ingredients: jinaResult.ingredients || []
          });
        } catch (jinaError) {
          if (isBlocked) {
            return res.status(403).json({ error: 'Site is protected by Cloudflare or anti-bot measures. Please try uploading a screenshot instead.' });
          }
          return res.json(parsed);
        }
    }

    console.log(`Successfully scraped title: ${parsed.title.trim()}`);
    res.json(parsed);
  } catch (error) {
    console.error('Error scraping URL:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      return res.status(error.response.status).json({ error: `Site returned error ${error.response.status}` });
    }
    res.status(500).json({ error: 'Failed to scrape URL: ' + error.message });
  }
});

// Upload recipe image only (no OCR). Optimizes with sharp (resize + webp) then returns path.
const MAX_IMAGE_SIDE = 1200;
app.post('/api/recipes/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const isImage = (req.file.mimetype || '').startsWith('image/');
  if (!isImage) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: 'File must be an image' });
  }
  const outFilename = uuidv4() + '.webp';
  const outPath = path.join(uploadsDir, outFilename);
  try {
    await sharp(req.file.path)
      .resize(MAX_IMAGE_SIDE, MAX_IMAGE_SIDE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outPath);
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.json({ path: `/uploads/${outFilename}` });
  } catch (err) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    console.error('Image optimization error:', err.message);
    return res.status(500).json({ error: 'Failed to process image' });
  }
});

app.post('/api/recipes/preview/upload', upload.single('screenshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const isPdf = req.file.mimetype === 'application/pdf' || /\.pdf$/i.test(req.file.originalname || '');
    let text;

    if (isPdf) {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      await parser.destroy();
      text = result.text || '';
    } else {
      const { data: { text: ocrText } } = await Tesseract.recognize(req.file.path, 'eng');
      text = ocrText;
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const title = lines[0] || (isPdf ? 'Recipe from PDF' : 'Scanned Recipe');
    const instructions = extractInstructionsFromText(lines.slice(1));

    res.json({
      title: title.trim(),
      screenshot: isPdf ? null : `/uploads/${req.file.filename}`,
      pdfPath: isPdf ? `/uploads/${req.file.filename}` : null,
      type: 'Scanned',
      rawText: text,
      instructions
    });
  } catch (error) {
    console.error('Preview upload error:', error);
    const msg = error.message || 'Unknown error';
    res.status(500).json({ error: `Failed to process file: ${msg}` });
  }
});

// Grocery list: send to Apple Notes (macOS only)
// Uses UI scripting to create native checklist items (Notes body property only supports plain text)
app.post('/api/grocery-list/send-to-notes', (req, res) => {
  const { title, items } = req.body;
  const list = Array.isArray(items) ? items.map((i) => String(i).trim()) : [];
  const noteTitle = (title && String(title).trim()) || 'Grocery List';

  if (process.platform !== 'darwin') {
    return res.status(501).json({ error: 'Apple Notes integration is only available on macOS' });
  }

  const escapeForAppleScript = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const safeTitle = escapeForAppleScript(noteTitle);

  const itemLines = list.map((item) => {
    const safe = escapeForAppleScript(item);
    return `    keystroke "${safe}"
    keystroke return`;
  });

  const checklistBlock = itemLines.length > 0
    ? `    keystroke "l" using {command down, shift down}
    delay 0.2
${itemLines.join('\n')}`
    : '';

  const script = `tell application "Notes" to activate
delay 0.5
tell application "System Events"
  tell process "Notes"
    keystroke "n" using command down
    delay 0.3
    keystroke "${safeTitle}"
    keystroke return
${checklistBlock}
  end tell
end tell`;

  const scriptPath = path.join(uploadsDir, `grocery-notes-${Date.now()}.scpt`);
  try {
    fs.writeFileSync(scriptPath, script);
    exec(`osascript "${scriptPath}"`, (err, stdout, stderr) => {
      try { fs.unlinkSync(scriptPath); } catch (_) {}
      if (err) {
        console.error('AppleScript error:', err, stderr);
        return res.status(500).json({
          error: 'Failed to create Apple Note. Grant Automation/Accessibility permission for Notes and Terminal.'
        });
      }
      res.json({ success: true });
    });
  } catch (writeErr) {
    return res.status(500).json({ error: 'Failed to write AppleScript' });
  }
});

// Handle multer file size limit (and other errors)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  next(err);
});

// Health check for Docker/orchestration (restart if app hangs)
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Static files last so /api/* is handled above
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
