import { openDB } from 'idb'; // Mengimpor openDB dari idb
import CONFIG from '../data/config';

const FavoriteRestaurantIdb = {
  async getAllRestaurants() {
    const db = await this._openDb(); // Membuka DB
    const store = db.transaction(CONFIG.OBJECT_STORE_NAME, 'readonly').objectStore(CONFIG.OBJECT_STORE_NAME);
    return store.getAll(); // Mengambil semua restoran
  },

  async getRestaurant(id) {
    const db = await this._openDb();
    const store = db.transaction(CONFIG.OBJECT_STORE_NAME, 'readonly').objectStore(CONFIG.OBJECT_STORE_NAME);
    return store.get(id); // Mengambil restoran berdasarkan ID
  },

  async putRestaurant(restaurant) {
    const db = await this._openDb();
    const store = db.transaction(CONFIG.OBJECT_STORE_NAME, 'readwrite').objectStore(CONFIG.OBJECT_STORE_NAME);
    await store.put(restaurant); // Menyimpan restoran ke dalam IndexedDB
  },

  async deleteRestaurant(id) {
    const db = await this._openDb();
    const store = db.transaction(CONFIG.OBJECT_STORE_NAME, 'readwrite').objectStore(CONFIG.OBJECT_STORE_NAME);
    await store.delete(id); // Menghapus restoran berdasarkan ID
  },

  async _openDb() {
    return openDB(CONFIG.DATABASE_NAME, CONFIG.DATABASE_VERSION, {
      upgrade(db) {
        // Membuat object store jika belum ada
        if (!db.objectStoreNames.contains(CONFIG.OBJECT_STORE_NAME)) {
          db.createObjectStore(CONFIG.OBJECT_STORE_NAME, { keyPath: 'id' });
        }
      }
    });
  }
};

export default FavoriteRestaurantIdb;
