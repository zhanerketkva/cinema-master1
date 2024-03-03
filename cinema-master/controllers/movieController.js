const User = require('../models/User');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const tmdbApi = require('../api/tmdbApi')
const {validationResult} = require('express-validator');

const handleValidationErrors = (req, res, message) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: message, errors});
    }
    return null;
}

class MovieController {

    async getMovies(req, res) {
        try {
            const {searchTitle} = req.query;
            let query = {};

            if (searchTitle) {
                const regex = new RegExp(searchTitle, "i");
                query = {title: regex};
            }

            const movies = await Movie.find(query, {__v: 0});
            return res.status(200).json(movies)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Failed to get movies"});
        }
    }

    async getMovie(req, res) {
        try {
            let query = {movieId: req.params.movieId};
            const movie = await Movie.findOne(query, {__v: 0});

            return res.status(200).json(movie)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Failed to get movie"});
        }
    }

    async addMovie(req, res) {
        try {
            const validationError = await handleValidationErrors(req, res, "Failed to add movie");
            if (validationError) return validationError;

            const {title} = req.body

            const movieId = await tmdbApi.getFirstMovieIdByTitle(title);
            const movieInfo = await tmdbApi.getMovieInfoById(movieId);
            const trailerUrl = await tmdbApi.getMovieTrailerUrlByMovieId(movieId);

            const movie = new Movie({...movieInfo, trailerUrl});
            await movie.save();

            return res.status(201).json({message: "Movie added", movie});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Failed to add movie"});
        }
    }

    async deleteMovieById(req, res) {
        try {
            const validationError = await handleValidationErrors(req, res, "Failed to delete movie");
            if (validationError) return validationError;

            const {movieId} = req.params;
            const deletedMovie = await Movie.findByIdAndDelete(movieId);

            if (!deletedMovie) {
                return res.status(404).json({message: "Movie not found"});
            }

            return res.status(200).json({message: "Movie deleted", movie: deletedMovie});
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Failed to delete movie"});
        }
    }

    async rateMovie(req, res) {
        try {
            // const validationError = await handleValidationErrors(req, res, "Failed to rate movie");
            // if (validationError) return validationError;

            const {movieId} = req.params;
            const {rating, userId} = req.body;

            const movie = await Movie.findById(movieId);
            console.log('movie:', movie);
            if (!movie) {
                return res.status(404).json({message: "Movie not found"});
            }

            let userRating = await Rating.findOne({userId, movieId}, {__v: 0});
            console.log('userRating:', userRating);
            if (userRating) {
                if (userRating.rating === rating) {
                    return res.status(200).json({message: "Movie rated successfully", rating: userRating});
                }
                userRating.userId = userId;
                userRating.rating = rating;
                await userRating.save();
            } else {
                userRating = new Rating({userId, movieId, rating});
                await userRating.save();
            }

            const ratings = await Rating.find({movieId});
            const totalRatings = ratings.length;
            const totalRatingSum = ratings.reduce((acc, cur) => acc + cur.rating, 0);
            movie.averageRating = totalRatingSum / totalRatings;
            await movie.save();

            return res.status(200).json({message: "Movie rated successfully", rating: userRating});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Failed to rate movie"});
        }
    }

}

module.exports = new MovieController();