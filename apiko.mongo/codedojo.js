const DataBase = require('./codedojodb');

const db = new DataBase('mdb');

db.connect('movies')
    .then(collectionMovies => {
        collectionMovies.find({ year: 2018 }).toArray().then(res => {
            console.log(res);
            db.close();
        });
    })
    .catch(console.error);
