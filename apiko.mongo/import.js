/* Structure of Collections
{
    "_id": "5b25758e952cba018785d353",
    "title": "Gudfadern",
    "year": "1972",
    "genres": [ "Crime", "Drama" ],
    "ratings": [ 6, 10, 4, 10, 1, 3 ],
    "poster": "MV5BZTRmNjQ1ZDYtNDgzMy00OGE0LWE4N2YtNTkzNWQ5ZDhlNGJmL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY500_CR0,0,352,500_AL_.jpg",
    "contentRating": "15",
    "duration": "PT175M",
    "releaseDate": "1972-09-27",
    "averageRating": 0,
    "originalTitle": "The Godfather",
    "storyline": "When the aging head of a famous crime family decides to transfer his position to one of his subalterns, a series of unfortunate events start happening to the family, and a war begins between all the well-known families leading to insolence, deportation, murder and revenge, and ends with the favorable successor being finally chosen.                Written by\nJ. S. Golden",
    "actors": [
        "Marlon Brando",
        "Al Pacino",
        "James Caan"
    ],
    "imdbRating": 9.2,
    "posterurl": "https://images-na.ssl-images-amazon.com/images/M/MV5BZTRmNjQ1ZDYtNDgzMy00OGE0LWE4N2YtNTkzNWQ5ZDhlNGJmL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY500_CR0,0,352,500_AL_.jpg"
}
 */

const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'mongodb://mongo';
const dbName = 'mdb';

// Use connect method to connect to the server
MongoClient.connect(dbUrl, function(err, client) {
    const db = client.db(dbName);

    /** READ */
    /** Find a document */
    db.movies.find({ year: "1972" }).count();
    db.movies.find({ actors: "Al Pacino" });

    /** где содержаться или тот или тот или и тот и тот */
    db.movies.find({ actors: {$in: ["Al Pacino", "Marlon Brando"] }});

    /** где содержаться и тот и тот */
    db.movies.find({ actors: {$all: ["Al Pacino", "Marlon Brando"] }});

    /** Where actors on first position in array */
    db.movies.find({ "actors.0": "Marlon Brando" });

    /** Find one document */
    db.movies.findOne({ actors: "Al Pacino" });

    /** Find document with this fields */
    db.movies.find({ actors: "Al Pacino" }, { title: true, year: true });
    db.getCollection("movies").find({ actors: "Al Pacino" }, { _id: false, title: true });

    /** Sorted */
    db.getCollection("movies").find({}).sort({ year: 1 });
    db.getCollection("movies").find({}).sort({ year: -1 });
    db.getCollection("movies").find({ actors: "Al Pacino" }).sort({ title: 1, imdbRating: -1 });

    /** Пропустить указанное кол-во документов в выборке */
    db.getCollection("movies").find().skip(100);

    /** Получить переданное количество первых результатов */
    db.getCollection("movies").find().limit(5);

    /** CREATE */
    /** Insert One Document */
    db.getCollection('movies').insertOne({ title: 'Deadpool 2', year: 2018, actors: ['Ryan Raynolds'] });

    /** Insert Many Documents */
    db.getCollection('movies').insert([
        { title: 'Deadpool 2', year: 2018, actors: [ 'Ryan Reynolds', 'Josh Brolin', 'Morena Baccarin'] },
        { title: 'Deadpool', year: 2016, actors: [ 'Ryan Reynolds', 'Morena Baccarin', 'T.J. Miller'] }
    ]);

    /** UPDATE */
    /** Update Documents */
    db.getCollection('movies').updateMany({ title: 'American Beauty' }, { $set: {title: 'American Shit Beauty' }});

    /** Increment value */
    db.getCollection('movies').updateMany({ actors: 'Al Pacino', year: '1972' }, { $inc: {userReviews: 1 }});

    /** Add Value into Array */
    db.getCollection('movies').updateMany({ actors: 'Al Pacino', year: '1972' }, { $push: {actors: 'Richard S. Castellano' }});

    /** Remove Value into Array */
    db.getCollection('movies').updateMany({ actors: 'Al Pacino', year: '1972' }, { $pull: {actors: 'Richard S. Castellano' }});

    /** Add to Array non duplicate value */
    db.getCollection('movies').updateMany({ actors: 'Al Pacino', year: '1972' }, { $addToSet: {actors: 'Robert Duvall' }});

    /** Добавить в массив не массив, а элементы массива (т.е. перебрать массив и каждый эллемент добавить) */
    db.getCollection('movies').updateMany({ actors: 'Al Pacino', year: '1972' }, {
        $addToSet: {
            actors: {
                $each: ['Sterling Hayden', 'John Marley', 'Richard Conte']
            }
        }
    });

    /** Remove property from Document */
    db.getCollection('movies').updateMany({ actors: 'Al Pacino', year: '1972' }, {
        $unset: { ratings: '' }
    });

    /** REMOVE */
    db.getCollection('movies').deleteMany({ year: 2016 });
    db.getCollection('movies').deleteOne({ year: 2016 });

    /** Comparision Operators */
    db.getCollection('movies').find({ actors: { $eq: 'Al Pacino'} }, { _id: 0, title: 1, year: 1 });
    db.getCollection('movies').find({ year: { $gt: '2016'} }, { _id: 0, title: 1, year: 1 });
    db.getCollection('movies').find({ year: { $lt: '1930'} }, { _id: 0, title: 1, year: 1 });
    db.getCollection('movies').find({ year: { $gte: '2016'} }, { _id: 0, title: 1, year: 1 });
    db.getCollection('movies').find({ year: { $lte: '1930'} }, { _id: 0, title: 1, year: 1 });
    db.getCollection('movies').find({ year: { $lte: '1930' }, rated: { $in: ['R', 'PG-13'] }}, { _id: 0, title: 1, year: 1 });

    db.getCollection('movies').find({ ratings: { $exists: false }});
    db.getCollection('movies').find({ tomato: { $exists: true }, ratings: { $ne: null }});
    db.getCollection('movies').find({ year: { $type: 'int' }});

    db.getCollection('movies').find({
        $and: [
            { tomato: { $exists: true }},
            { tomato: { $ne: null }}
        ]
    });

    db.getCollection('movies').find({
        $or: [
            { tomato: { $exists: true }},
            { tomato: { $ne: null }}
        ]
    });


////
    client.close();
});
