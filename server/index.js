const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { addRecipe, getAllRecipes, migrateFromJsonIfNeeded, removeRecipe, removeRecipes, updateRecipe, getAllRestaurants, addRestaurant, updateRestaurant, removeRestaurant, getAllFoodTypes, addFoodType, updateFoodType, removeFoodType } = require('./db');
const { chromium } = require('playwright');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'server/uploads/' });

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

app.post('/api/recipes', (req, res) => {
  const { title, url, screenshot, type, rawText, instructions, ingredients, foodType } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const recipe = {
    id: uuidv4(),
    title,
    url,
    screenshot,
    type: type || 'General',
    rawText,
    instructions: normalizeInstructions(instructions || []),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
    dateAdded: new Date().toISOString()
  };

  addRecipe(recipe);
  res.status(201).json(recipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, screenshot, type, rawText, instructions, ingredients, dateAdded, foodType } = req.body;
  if (!id) return res.status(400).json({ error: 'Recipe id is required' });
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const recipe = {
    id,
    title,
    url,
    screenshot,
    type: type || 'General',
    rawText,
    instructions: normalizeInstructions(instructions || []),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
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

app.post('/api/restaurants', (req, res) => {
  const { name, orderingUrl, foodType } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Restaurant name is required' });
  }
  const restaurant = {
    id: uuidv4(),
    name: name.trim(),
    orderingUrl: orderingUrl && orderingUrl.trim() ? orderingUrl.trim() : null,
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
    dateAdded: new Date().toISOString()
  };
  addRestaurant(restaurant);
  res.status(201).json(restaurant);
});

app.put('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const { name, orderingUrl, foodType } = req.body;
  if (!id) return res.status(400).json({ error: 'Restaurant id is required' });
  if (!name || !name.trim()) return res.status(400).json({ error: 'Restaurant name is required' });
  const restaurant = {
    id,
    name: name.trim(),
    orderingUrl: orderingUrl && orderingUrl.trim() ? orderingUrl.trim() : null,
    foodType: foodType && foodType.trim() ? foodType.trim() : null,
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

app.post('/api/recipes/preview/upload', upload.single('screenshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const title = lines[0] || 'Scanned Recipe';
    const instructions = extractInstructionsFromText(lines.slice(1));

    res.json({
      title: title.trim(),
      screenshot: `/uploads/${req.file.filename}`,
      type: 'Scanned',
      rawText: text,
      instructions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Static files last so /api/* is handled above
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
