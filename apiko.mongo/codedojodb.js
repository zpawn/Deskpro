const { MongoClient } = require('mongodb');

const DATABASE_CONNECTION = 'mongodb://mongo/mdb';

const connect = MongoClient.connect(DATABASE_CONNECTION);

class DataBase {
    constructor (name) {
        this.name = name
    }

    connect (collectionName) {
        return connect.then(client => client.db(this.name).collection(collectionName));
    }

    close () {
        return connect.then(client => client.close());
    }
}

module.exports = DataBase;
