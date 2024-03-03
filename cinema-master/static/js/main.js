request_user = localStorage.getItem('request_user');
console.log(request_user);


username = document.querySelector('#user-name');
if (request_user) {
    user = JSON.parse(request_user);
    username.innerHTML = user.username;
}
else {
    username.innerHTML = '<a style="color: #FFF;" href="../../templates/login.html">Login</a>';
}


function openProfile() {
    let profileBlock = document.querySelector('.profile_open_block');
    if (profileBlock.style.display === 'none') {
        profileBlock.style.display = 'flex';
    }
    else {
        profileBlock.style.display = 'none';
    }
}


function logoutAccount() {
    localStorage.removeItem('request_user');
    window.location.href = 'index.html';
}


function openSearchPage() {
    let searchBlock = document.querySelector('#search-block-container');
    if (searchBlock.style.display === 'none') {
        searchBlock.style.display = 'flex';
    }
    else {
        searchBlock.style.display = 'none';
    }
}

function searchMovie() {
    fetch(`http://127.0.0.1:3000/api/v1/movies/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const movies = data;
        console.log(movies);

        const input = document.getElementById('movie-search');
        const movieList = document.getElementById('movie-list');
        const searchValue = input.value.toLowerCase();
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchValue));
        
        renderMovies(filteredMovies, movieList);
    }).catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

function renderMovies(filteredMovies, movieList) {
    movieList.innerHTML = '';
    filteredMovies.forEach(movie => {
        console.log(movie.title)
        const movieElement = document.createElement('a');
        movieElement.setAttribute('href', `detail.html?movieId=${movie.movieId}`)
        movieElement.textContent = movie.title;
        movieList.appendChild(movieElement);
    });
}

searchMovie();