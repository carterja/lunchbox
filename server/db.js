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

const insertRecipe = db.prepare(`
  INSERT INTO recipes (
    id, title, url, screenshot, type, raw_text, instructions, ingredients, food_type, date_added
  ) VALUES (
    @id, @title, @url, @screenshot, @type, @raw_text, @instructions, @ingredients, @food_type, @date_added
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
      food_type = @food_type
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
const selectAllRestaurants = db.prepare('SELECT * FROM restaurants ORDER BY date_added DESC');
const insertRestaurant = db.prepare(`
  INSERT INTO restaurants (id, name, ordering_url, food_type, date_added)
  VALUES (@id, @name, @ordering_url, @food_type, @date_added)
`);
const deleteRestaurantById = db.prepare('DELETE FROM restaurants WHERE id = ?');
const updateRestaurantById = db.prepare(`
  UPDATE restaurants
  SET name = @name, ordering_url = @ordering_url, food_type = @food_type
  WHERE id = @id
`);

const restaurantToRow = (r) => ({
  id: r.id,
  name: r.name,
  ordering_url: r.orderingUrl || null,
  food_type: r.foodType || null,
  date_added: r.dateAdded
});

const restaurantFromRow = (row) => ({
  id: row.id,
  name: row.name,
  orderingUrl: row.ordering_url,
  foodType: row.food_type || null,
  dateAdded: row.date_added
});

const getAllRestaurants = () => selectAllRestaurants.all().map(restaurantFromRow);

const addRestaurant = (restaurant) => {
  insertRestaurant.run(restaurantToRow(restaurant));
  return restaurant;
};

const updateRestaurant = (restaurant) => {
  const result = updateRestaurantById.run(restaurantToRow(restaurant));
  return result.changes > 0;
};

const removeRestaurant = (id) => {
  const result = deleteRestaurantById.run(id);
  return result.changes > 0;
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
  getAllFoodTypes,
  addFoodType,
  updateFoodType,
  removeFoodType
};
