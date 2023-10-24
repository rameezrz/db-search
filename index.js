const { MongoClient, ObjectId } = require("mongodb");

/**
 * Connect to the database and return the database client.
 * @param {string} databaseURL - MongoDB connection URL.
 * @returns {Promise<{ db, client }>} - A promise that resolves with the database and client.
 */
async function connectDB(databaseURL) {
  const client = new MongoClient(databaseURL);
  try {
    await client.connect();
    const db = client.db();
    return { db, client };
  } catch (error) {
    throw new Error(`Error connecting to the database: ${error.message}`);
  }
}

/**
 * Search for users in the database.
 * @param {string} databaseURL - MongoDB connection URL.
 * @param {string} query - Search query for users.
 * @returns {Promise<Array>} - A promise that resolves with an array of matching users.
 */
async function searchUser(databaseURL, query) {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await connectDB(databaseURL);
      const collection = db.collection("users");
      const result = await collection
        .find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();

      if (result.length === 0) {
        reject("No matching users found");
      } else {
        const filteredResults = result.map((doc) => {
          const { password, __v, ...rest } = doc;
          return rest;
        });
        resolve(filteredResults);
      }

      client.close();
    } catch (error) {
      reject(`Error searching for users in the database: ${error.message}`);
    }
  });
}

/**
 * Search for products in the database.
 * @param {string} databaseURL - MongoDB connection URL.
 * @param {string} query - Search query for products.
 * @returns {Promise<Array>} - A promise that resolves with an array of matching products.
 */
async function searchProduct(databaseURL, query) {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await connectDB(databaseURL);
      const collection = db.collection("products");
      const result = await collection
        .find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();

      if (result.length === 0) {
        reject("No matching products found");
      } else {
        const filteredResults = result.map((doc) => {
          const { __v, ...rest } = doc;
          return rest;
        });
        resolve(filteredResults);
      }

      client.close();
    } catch (error) {
      reject(`Error searching for products in the database: ${error.message}`);
    }
  });
}

/**
 * Search for an order by its ID in the database.
 * @param {string} databaseURL - MongoDB connection URL.
 * @param {string} orderId - ID of the order to search for.
 * @returns {Promise<Object>} - A promise that resolves with the order object or rejects if not found.
 */
async function searchOrder(databaseURL, orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const { db, client } = await connectDB(databaseURL);
      const collection = db.collection("orders");
      const result = await collection.findOne({ _id: new ObjectId(orderId) });

      if (!result) {
        reject("Invalid Order ID");
      } else {
        resolve(result);
      }

      client.close();
    } catch (error) {
      reject(`Error searching for orders in the database: ${error.message}`);
    }
  });
}

module.exports = { searchUser, searchProduct, searchOrder };
