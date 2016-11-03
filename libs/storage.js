/**
 * File-based storage module for Tokinar
 *
 * @todo Add indexing support.
 * @todo Make methods async and return Promises.
 */

const path = require("path");
const fs = require("fs");

/**
 * Creates a storage instance at the directory specified.
 *
 * @param {string} [storageDir=storage] Path to the storage directory, to be
 * relatively resolved from the root of the project.
 */
let storage = function (storageDir) {
  this.storageDir = path.resolve(process.env.PWD, storageDir || "storage");

  if (!fs.existsSync(this.storageDir)) {
    fs.mkdirSync(this.storageDir, 0700);
  }

  return this;
};

/**
 * Get path to a collection in the current storage.
 *
 * @param {string} collection The id of the collection.
 * @returns {string} Path to the collection as a string.
 */
storage.prototype.collection_path = function (collection) {
  return path.join(this.storageDir, collection);
};

/**
 * Get path to a key file in a collection
 *
 * @param {string} collection The id of the collection.
 * @param {string} key The id of the item in the collection.
 * @returns {string} Path to the collection as a string.
 */
storage.prototype.key_path = function (collection, key) {
  return path.join(this.collection_path(collection), `${key}.json`);
};

/**
 * Check if a collection and optionally a key in a collection exists.
 *
 * @param {string} collection The id of a collection
 * @param {string} [key] The id of an item in the collection. If
 * provided, this method also checks if the given key is present in
 * the collection.
 *
 * @returns {Boolean} Returns `true` if exists, else false.
 *
 * @todo Return Promise and make method async
 */
storage.prototype.exists = function (collection, key) {
  return fs.existsSync(!!key ? this.key_path(collection, key) : this.collection_path(collection));
};

/**
 * Creates a collection, essentially, creating a directory for the
 * collection on disk.
 *
 * @param {string} collection The id of the collection.
 *
 * @todo Return Promise and make method async
 */
storage.prototype.create_collection = function (collection) {
  fs.mkdirSync(this.collection_path(collection), 0700);
};

/**
 * Get the contents of an item from a collection.
 *
 * @param {string} collection The id of a collection.
 * @param {string} key The id of an item in the collection.
 *
 * @returns {Object|null} Returns the stored JSON object, if `key`
 * exists in `collection`, else, returns `null`.
 *
 * @todo Return Promise and make method async
 */
storage.prototype.get = function (collection, key) {
  if (!this.exists(collection, key)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(this.key_path(collection, key), "utf8"));
};

/**
 * Put content into a key in a collection. Overwrites existing content
 * if present.
 *
 * @param {string} collection The id of a collection.
 * @param {string} key The id of an item in the collection.
 * @param {Object|Array} data The data to put in the key
 *
 * @todo Return Promise and make method async
 */
storage.prototype.put = function (collection, key, data) {
  if (!this.exists(collection)) {
    this.create_collection(collection);
  }
  fs.writeFileSync(this.key_path(collection, key), JSON.stringify(data), {
    encoding: "utf8",
    mode: 0600
  });
};

/**
 * Delete an item from a collection
 *
 * @param {string} collection The id of a collection.
 * @param {string} key The id of an item in the collection.
 *
 * @todo Return Promise and make method async
 */
storage.prototype.delete = function (collection, key) {
  if (this.exists(collection, key)) {
    fs.unlinkSync(this.key_path(collection, key));
  }
};

// Export storage
module.exports = storage;
