async function getMovieById(movieId) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/movies/${movieId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to get movie');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    
    if (movieId) {
        const movie_data = await getMovieById(movieId);
        if (movie_data) {
            const movieTitle = movie_data.title;
            const movieDescription = movie_data.description;
            const moviePosterUrl = movie_data.posterUrl;

            document.querySelectorAll('.movie-data-title').forEach(element => {
                element.innerHTML = movieTitle;
            });
            document.querySelector('#page-title').innerHTML = movieTitle;
            document.querySelector('.movie-data-image').style.backgroundImage = `url(${moviePosterUrl})`;
            document.querySelector('.movie-data-description').innerHTML = movieDescription;
            
            rating = JSON.parse(localStorage.getItem('rating_' + movie_data._id + '_' + user._id));
            console.log(rating);
            
            if (rating && rating.movieId === movie_data._id && rating.userId === user._id) {
                document.querySelector('.current_rating').innerHTML = `Your rate: ${rating.rating}`;
                document.querySelector('.rate_the_film_block_container').style.display = 'none';
            }
            else {
                document.querySelector('.rate_the_film_block_container').style.display = 'block';
            }

        } else {
            console.error('Failed to get movie details');
        }
    } else {
        console.error('Movie ID not specified in URL');
    }
});


function setRating(value) {
    let rating_list = document.querySelectorAll('.rating_for_movie i');
    for (let i = 0; i < rating_list.length; i++) {
        if (i < value) {
            rating_list[i].classList.add('active');
        } else {
            rating_list[i].classList.remove('active');
        }
    }
}

function resetRating() {
    let rating_list = document.querySelectorAll('.rating_for_movie i');
    rating_list.forEach((star) => {
        star.classList.remove('active');
    });
}

function rateTheMovie() {
    ratingBlock = document.querySelector('.set_rating_for_movie_block');
    ratingBlock.style.display = 'flex';
}

function closeRatingBlock() {
    ratingBlock = document.querySelector('.set_rating_for_movie_block');
    ratingBlock.style.display = 'none';
}

async function rateMovie(value) {
    const user = JSON.parse(localStorage.getItem('request_user'));
    if (!user) {
        console.error('User not found in localStorage');
        return;
    }

    const rating = value;
    const userId = user._id;
    const data = { rating, userId };

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');
    const movie_data = await getMovieById(movieId);

    if (!movie_data || !movie_data._id) {
        console.error('Failed to get movie data or movie data is invalid');
        return;
    }

    const movie_id = movie_data._id;
    const url = `http://127.0.0.1:3000/api/v1/movies/${movie_id}/rate`;

    let response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        localStorage.setItem(`rating_${movie_id}_${userId}`, JSON.stringify(data.rating));
        window.location.reload();
        closeRatingBlock();
    }).catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}