const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to database');

    const createCollections = async () => {
        try {
            await Movie.createCollection();
            await Rating.createCollection();

            console.log('Collections created');

            const movies = [
                {
                    movieId: 1,
                    title: 'Фильм 1',
                    description: 'Описание фильма 1',
                    posterUrl: 'url1',
                    trailerUrl: 'url1',
                    releaseDate: new Date('2022-01-01'),
                    averageRating: 0,
                },
                {
                    movieId: 2,
                    title: 'Фильм 2',
                    description: 'Описание фильма 2',
                    posterUrl: 'url2',
                    trailerUrl: 'url2',
                    releaseDate: new Date('2022-02-01'),
                    averageRating: 0,
                },
            ];

            await Movie.insertMany(movies);

            const ratings = [
                { id: 1, userId: ObjectId(), movieId: ObjectId(), rating: 5 },
                { id: 2, userId: ObjectId(), movieId: ObjectId(), rating: 4 },
            ];

            await Rating.insertMany(ratings);

            console.log('Data inserted');
        } catch (error) {
            console.error('Error creating collections and inserting data:', error);
        } finally {
            mongoose.disconnect();
        }
    };

    createCollections().then(() => {
        console.log('Migration completed');
        process.exit(0);
    });
}).catch(error => {
    console.error('Error connecting to database:', error);
    process.exit(1);
});
