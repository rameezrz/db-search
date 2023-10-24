const { MongoClient } = require('mongodb');

async function searchInDatabase(searchKeyword, databaseURL, collectionName) {
    try {
        const client = new MongoClient(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db();
        const collection = db.collection(collectionName); 

        const results = await collection.find({
            $text: { $search: searchKeyword }
        }).toArray();

        client.close();
        return results;
    } catch (error) {
        throw new Error(`Error searching in the database: ${error.message}`);
    }
}

module.exports = {searchInDatabase};
