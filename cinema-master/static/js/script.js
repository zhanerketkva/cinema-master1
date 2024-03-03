async function showAllMovies(data) {
    let movieList = document.querySelector('.movie-list');

    for (let i = 0; i < data.length; i++) {
        movieList.innerHTML += `
            <div class="movie-list-item">
                <img class="movie-list-item-img" src="${data[i].posterUrl}" alt="">
                <span class="movie-list-item-title">${data[i].title}</span>
                <button onclick="movieDetail(${data[i].movieId})" class="movie-list-item-button">Watch</button>
            </div>
        `;
    }
}


async function getAllMovies() {
    fetch('http://127.0.0.1:3000/api/v1/movies/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(async data => {
        await showAllMovies(data);
    }).catch(error => {
    });
}


function movieDetail(movieId) {
    window.location.href = `detail.html?movieId=${movieId}`;
}


getAllMovies();