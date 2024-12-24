const searcButton = document.querySelector('.search-button')
searcButton.addEventListener('click', async function(){
    try{
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value);
        updateUI(movies);   
    }catch (err){
        console.log(err);
    }
})

document.addEventListener('click', async function(e){
    if (e.target.classList.contains('modal-detail-button')){
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }    
});

function getMovies(keyword){
    return fetch(`http://www.omdbapi.com/?apikey=ef0eab7b&s=${keyword}`)
        .then(response => {
            if (!response.ok){
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(response => {
            if (response.Response === "False"){
                throw new Error(response.error);
            }

            return response.Search;
        });
}

function getMovieDetail(imdbid){
    return fetch(`http://www.omdbapi.com/?apikey=ef0eab7b&i=${imdbid}`)
        .then(response => response.json())
        .then(m => m);
}

function updateUI(movies){
    let cards = '';
    movies.forEach(movie => cards += showMovie(movie));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
}

function updateUIDetail(m){
    const movieDet = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDet;
}


function showMovie(movie){
    return `<div class="col-md-4 my-3">
                <div class="card" style="width: 18rem;">
                    <img src="${movie.Poster}" class="card-img-top">
                    <div class="card-body">
                      <h5 class="card-title">${movie.Title}</h5>
                      <h6 class="card-subtitle mb-2 text-body-secondary">${movie.Year}</h6>
                      <a href="#" class="btn btn-primary modal-detail-button" 
                      data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Show Detail</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetail(m){
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${m.Poster}" class="img-fluid">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>Title: ${m.Title}</h4></li>
                            <li class="list-group-item"><strong>Director: </strong>${m.Director}</li>
                            <li class="list-group-item"><strong>Actors: </strong>${m.Actors}</li>
                            <li class="list-group-item"><strong>Writer: </strong>${m.Writer}</li>
                            <li class="list-group-item"><strong>Plot: </strong><br>${m.Plot}</li>
                        </ul>
                    </div>
                </div>
            </div>`
}