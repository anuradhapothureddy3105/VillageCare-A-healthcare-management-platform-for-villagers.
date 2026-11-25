import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../data/db.json');

let store = {
  users: [],
  households: [],
  surveys: [],
  recommendations: [],
  pregnancy_records: [],
  appointments: [],
  followups: [],
  awareness_contents: [],
  notifications: [],
  consents: [],
  settings: [],
};

export const initializeStore = async () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      store = { ...store, ...JSON.parse(data) };
      console.log(`[Store] Loaded persistent data from ${DB_FILE}`);
    } else {
      saveStore();
    }
  } catch (err) {
    console.warn('[Store] Initializing clean store:', err.message);
  }
};

export const saveStore = () => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Error saving store:', err.message);
  }
};

const matchQuery = (item, query = {}) => {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, value] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(value)) {
      const orMatch = value.some((subQ) => matchQuery(item, subQ));
      if (!orMatch) return false;
      continue;
    }
    if (typeof value === 'object' && value !== null) {
      if (value.$regex) {
        const regex = new RegExp(value.$regex, value.$options || 'i');
        if (!regex.test(String(item[key] || ''))) return false;
      } else if (value.$in && Array.isArray(value.$in)) {
        if (!value.$in.includes(item[key])) return false;
      } else if (value.$ne !== undefined) {
        if (item[key] === value.$ne) return false;
      }
    } else {
      if (item[key] !== value) return false;
    }
  }
  return true;
};

export class CollectionModel {
  constructor(name) {
    this.name = name;
  }

  get items() {
    if (!store[this.name]) store[this.name] = [];
    return store[this.name];
  }

  async find(query = {}) {
    return this.items.filter((item) => matchQuery(item, query));
  }

  async findOne(query = {}) {
    return this.items.find((item) => matchQuery(item, query)) || null;
  }

  async findById(id) {
    return this.items.find((item) => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const id = doc._id || 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const newDoc = {
      ...doc,
      _id: id,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newDoc);
    saveStore();
    return newDoc;
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const index = this.items.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return null;
    const current = this.items[index];
    const updated = {
      ...current,
      ...(updates.$set ? updates.$set : updates),
      updatedAt: new Date().toISOString(),
    };
    this.items[index] = updated;
    saveStore();
    return updated;
  }

  async findByIdAndDelete(id) {
    const index = this.items.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return null;
    const removed = this.items.splice(index, 1)[0];
    saveStore();
    return removed;
  }

  async countDocuments(query = {}) {
    return (await this.find(query)).length;
  }

  async deleteMany(query = {}) {
    const originalLength = this.items.length;
    store[this.name] = this.items.filter((item) => !matchQuery(item, query));
    saveStore();
    return { deletedCount: originalLength - store[this.name].length };
  }
}

export const getStore = () => store;
export const setStore = (newStore) => {
  store = newStore;
  saveStore();
};
