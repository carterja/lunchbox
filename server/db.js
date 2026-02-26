const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'recipes.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    screenshot TEXT,
    type TEXT,
    raw_text TEXT,
    instructions TEXT,
    date_added TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ordering_url TEXT,
    food_type TEXT,
    date_added TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS food_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`);
// Add food_type to existing tables if missing
try { db.exec('ALTER TABLE recipes ADD COLUMN food_type TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN food_type TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE recipes ADD COLUMN ingredients TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE recipes ADD COLUMN pdf_path TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE recipes ADD COLUMN tags TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN tags TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN main_url TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN icon_url TEXT'); } catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN icon_bg_light INTEGER DEFAULT 1'); } catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN icon_bg TEXT'); } catch (_) {}
try {
  db.exec(`UPDATE restaurants SET icon_bg = CASE WHEN COALESCE(icon_bg_light, 1) = 0 THEN 'dark' ELSE 'light' END WHERE icon_bg IS NULL OR icon_bg = ''`);
} catch (_) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0'); } catch (_) {}
// Backfill sort_order by date_added DESC so existing rows keep current order
try {
  const backfill = db.prepare(`
    UPDATE restaurants SET sort_order = (
      SELECT COUNT(*) FROM restaurants r2
      WHERE r2.date_added > restaurants.date_added
         OR (r2.date_added = restaurants.date_added AND r2.id < restaurants.id)
    )
  `);
  backfill.run();
} catch (_) {}
db.exec(`
  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`);

const defaultFoodTypes = [
  'Pizza', 'Chinese', 'Thai', 'Burgers', 'Fast food', 'Pasta', 'Mexican', 'Indian', 'Japanese', 'Other'
];
const selectFoodTypes = db.prepare('SELECT * FROM food_types ORDER BY sort_order ASC, name ASC');
const insertFoodType = db.prepare('INSERT INTO food_types (id, name, sort_order) VALUES (@id, @name, @sort_order)');
const seedFoodTypes = () => {
  const existing = db.prepare('SELECT COUNT(*) as c FROM food_types').get();
  if (existing.c > 0) return;
  defaultFoodTypes.forEach((name, i) => {
    insertFoodType.run({ id: uuidv4(), name, sort_order: i });
  });
};
seedFoodTypes();

const getAllFoodTypes = () => selectFoodTypes.all().map((row) => ({ id: row.id, name: row.name }));
const addFoodType = (name) => {
  const id = uuidv4();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM food_types').get();
  insertFoodType.run({ id, name: name.trim(), sort_order: maxOrder.next });
  return { id, name: name.trim() };
};
const updateFoodType = (id, name) => {
  const result = db.prepare('UPDATE food_types SET name = @name WHERE id = @id').run({ id, name: name.trim() });
  return result.changes > 0;
};
const removeFoodType = (id) => {
  const nameRow = db.prepare('SELECT name FROM food_types WHERE id = ?').get(id);
  if (!nameRow) return false;
  db.prepare('UPDATE recipes SET food_type = NULL WHERE food_type = ?').run(nameRow.name);
  db.prepare('UPDATE restaurants SET food_type = NULL WHERE food_type = ?').run(nameRow.name);
  const result = db.prepare('DELETE FROM food_types WHERE id = ?').run(id);
  return result.changes > 0;
};

// Tags
const selectAllTags = db.prepare('SELECT * FROM tags ORDER BY sort_order ASC, name ASC');
const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name, sort_order) VALUES (@id, @name, @sort_order)');
const deleteTagById = db.prepare('DELETE FROM tags WHERE id = ?');
const getTagByName = db.prepare('SELECT id, name FROM tags WHERE name = ?');

const getAllTags = () => selectAllTags.all().map((row) => ({ id: row.id, name: row.name }));

const ensureTag = (name) => {
  const n = (name || '').trim();
  if (!n) return null;
  let row = getTagByName.get(n);
  if (!row) {
    const id = uuidv4();
    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM tags').get();
    insertTag.run({ id, name: n, sort_order: maxOrder.next });
    row = { id, name: n };
  }
  return row.name;
};

const addTag = (name) => {
  const n = (name || '').trim();
  if (!n) return null;
  const existing = getTagByName.get(n);
  if (existing) return { id: existing.id, name: existing.name };
  const id = uuidv4();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM tags').get();
  insertTag.run({ id, name: n, sort_order: maxOrder.next });
  return { id, name: n };
};

const removeTag = (id) => {
  const nameRow = db.prepare('SELECT name FROM tags WHERE id = ?').get(id);
  if (!nameRow) return false;
  const name = nameRow.name;
  const recipes = db.prepare('SELECT id, tags FROM recipes WHERE tags IS NOT NULL').all();
  recipes.forEach((r) => {
    const arr = r.tags ? JSON.parse(r.tags) : [];
    const next = arr.filter((t) => t !== name);
    db.prepare('UPDATE recipes SET tags = ? WHERE id = ?').run(JSON.stringify(next), r.id);
  });
  const restaurants = db.prepare('SELECT id, tags FROM restaurants WHERE tags IS NOT NULL').all();
  restaurants.forEach((r) => {
    const arr = r.tags ? JSON.parse(r.tags) : [];
    const next = arr.filter((t) => t !== name);
    db.prepare('UPDATE restaurants SET tags = ? WHERE id = ?').run(JSON.stringify(next), r.id);
  });
  const result = deleteTagById.run(id);
  return result.changes > 0;
};

const insertRecipe = db.prepare(`
  INSERT INTO recipes (
    id, title, url, screenshot, type, raw_text, instructions, ingredients, food_type, pdf_path, tags, date_added
  ) VALUES (
    @id, @title, @url, @screenshot, @type, @raw_text, @instructions, @ingredients, @food_type, @pdf_path, @tags, @date_added
  )
`);

const selectAllRecipes = db.prepare('SELECT * FROM recipes ORDER BY date_added DESC');
const deleteRecipeById = db.prepare('DELETE FROM recipes WHERE id = ?');
const updateRecipeById = db.prepare(`
  UPDATE recipes
  SET title = @title,
      url = @url,
      screenshot = @screenshot,
      type = @type,
      raw_text = @raw_text,
      instructions = @instructions,
      ingredients = @ingredients,
      food_type = @food_type,
      pdf_path = @pdf_path,
      tags = @tags
  WHERE id = @id
`);
const countRecipes = db.prepare('SELECT COUNT(*) as count FROM recipes');

const toRow = (recipe) => ({
  id: recipe.id,
  title: recipe.title,
  url: recipe.url || null,
  screenshot: recipe.screenshot || null,
  type: recipe.type || 'General',
  raw_text: recipe.rawText || null,
  instructions: JSON.stringify(recipe.instructions || []),
  ingredients: recipe.ingredients != null ? JSON.stringify(recipe.ingredients) : null,
  food_type: recipe.foodType || null,
  pdf_path: recipe.pdfPath || null,
  tags: recipe.tags != null ? JSON.stringify(recipe.tags) : null,
  date_added: recipe.dateAdded
});

const fromRow = (row) => ({
  id: row.id,
  title: row.title,
  url: row.url,
  screenshot: row.screenshot,
  type: row.type || 'General',
  rawText: row.raw_text,
  instructions: row.instructions ? JSON.parse(row.instructions) : [],
  ingredients: row.ingredients ? JSON.parse(row.ingredients) : [],
  foodType: row.food_type || null,
  pdfPath: row.pdf_path || null,
  tags: row.tags ? JSON.parse(row.tags) : [],
  dateAdded: row.date_added
});

const getAllRecipes = () => selectAllRecipes.all().map(fromRow);

const addRecipe = (recipe) => {
  insertRecipe.run(toRow(recipe));
  return recipe;
};

const updateRecipe = (recipe) => {
  const result = updateRecipeById.run(toRow(recipe));
  return result.changes > 0;
};

const removeRecipe = (id) => {
  const result = deleteRecipeById.run(id);
  return result.changes > 0;
};

const removeRecipes = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const removeMany = db.transaction((recipeIds) => {
    let removed = 0;
    recipeIds.forEach((id) => {
      removed += deleteRecipeById.run(id).changes;
    });
    return removed;
  });

  return removeMany(ids);
};

// Restaurants
const selectAllRestaurants = db.prepare('SELECT * FROM restaurants ORDER BY sort_order ASC, date_added DESC');
const insertRestaurant = db.prepare(`
  INSERT INTO restaurants (id, name, ordering_url, main_url, icon_url, icon_bg_light, icon_bg, food_type, tags, date_added, sort_order)
  VALUES (@id, @name, @ordering_url, @main_url, @icon_url, @icon_bg_light, @icon_bg, @food_type, @tags, @date_added, @sort_order)
`);
const deleteRestaurantById = db.prepare('DELETE FROM restaurants WHERE id = ?');
const updateRestaurantById = db.prepare(`
  UPDATE restaurants
  SET name = @name, ordering_url = @ordering_url, main_url = @main_url, icon_url = @icon_url, icon_bg_light = @icon_bg_light, icon_bg = @icon_bg, food_type = @food_type, tags = @tags
  WHERE id = @id
`);
const updateRestaurantSortOrder = db.prepare('UPDATE restaurants SET sort_order = ? WHERE id = ?');

const restaurantToRow = (r) => {
  const iconBg = r.iconBg != null && r.iconBg !== '' ? String(r.iconBg) : (r.iconBgLight === false || r.iconBgLight === 0 ? 'dark' : 'light');
  const iconBgLight = iconBg === 'dark' ? 0 : 1;
  return {
    id: r.id,
    name: r.name,
    ordering_url: r.orderingUrl || null,
    main_url: r.mainUrl || null,
    icon_url: r.iconUrl || null,
    icon_bg_light: iconBgLight,
    icon_bg: iconBg,
    food_type: r.foodType || null,
    tags: r.tags != null ? JSON.stringify(r.tags) : null,
    date_added: r.dateAdded,
    sort_order: r.sortOrder != null ? r.sortOrder : 0
  };
};

const restaurantFromRow = (row) => ({
  id: row.id,
  name: row.name,
  orderingUrl: row.ordering_url ?? null,
  mainUrl: row.main_url ?? null,
  iconUrl: row.icon_url ?? null,
  iconBgLight: row.icon_bg_light === undefined || row.icon_bg_light === null ? true : !!row.icon_bg_light,
  iconBg: row.icon_bg != null && row.icon_bg !== '' ? row.icon_bg : (row.icon_bg_light === 0 ? 'dark' : 'light'),
  foodType: row.food_type ?? null,
  tags: row.tags ? JSON.parse(row.tags) : [],
  dateAdded: row.date_added,
  sortOrder: row.sort_order != null ? row.sort_order : 0
});

const getAllRestaurants = () => selectAllRestaurants.all().map(restaurantFromRow);

const addRestaurant = (restaurant) => {
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM restaurants').get();
  const row = restaurantToRow(restaurant);
  row.sort_order = maxOrder.next;
  insertRestaurant.run(row);
  return { ...restaurant, sortOrder: maxOrder.next };
};

const updateRestaurant = (restaurant) => {
  const result = updateRestaurantById.run(restaurantToRow(restaurant));
  return result.changes > 0;
};

const removeRestaurant = (id) => {
  const result = deleteRestaurantById.run(id);
  return result.changes > 0;
};

const updateRestaurantOrder = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return;
  const run = db.transaction(() => {
    ids.forEach((id, index) => {
      updateRestaurantSortOrder.run(index, id);
    });
  });
  run();
};

const isEmpty = () => countRecipes.get().count === 0;

const migrateFromJsonIfNeeded = (jsonPath) => {
  if (!isEmpty()) return;
  if (!fs.existsSync(jsonPath)) return;

  try {
    const data = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    const insertMany = db.transaction((recipes) => {
      recipes.forEach((recipe) => {
        if (!recipe || !recipe.id || !recipe.title) return;
        const normalized = {
          id: recipe.id,
          title: recipe.title,
          url: recipe.url,
          screenshot: recipe.screenshot,
          type: recipe.type || 'General',
          rawText: recipe.rawText,
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
          dateAdded: recipe.dateAdded || new Date().toISOString()
        };
        insertRecipe.run(toRow(normalized));
      });
    });

    insertMany(parsed);
    console.log(`Migrated ${parsed.length} recipes from JSON into SQLite.`);
  } catch (error) {
    console.error('Failed to migrate recipes from JSON:', error);
  }
};

module.exports = {
  db,
  getAllRecipes,
  addRecipe,
  updateRecipe,
  removeRecipe,
  removeRecipes,
  migrateFromJsonIfNeeded,
  getAllRestaurants,
  addRestaurant,
  updateRestaurant,
  removeRestaurant,
  updateRestaurantOrder,
  getAllFoodTypes,
  addFoodType,
  updateFoodType,
  removeFoodType,
  getAllTags,
  addTag,
  ensureTag,
  removeTag
};
