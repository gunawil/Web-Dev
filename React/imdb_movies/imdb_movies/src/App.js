import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import SearchBar from './components/SearchBar';
import MovieDetailModal from './components/MovieDetailModal';
import MovieCard from './components/MovieCard';

function App() {
  const [movies, setMovies] = useState([]);
  // const [imdbId, setImdbdId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleMovieList(keyword='avenger'){
    try{
        keyword = !keyword ? 'avenger' : keyword;
        
        const response = await fetch(`http://www.omdbapi.com/?apikey=ef0eab7b&s=${keyword}`)

        if (!response.ok){
            throw new Error(response.statusText);
        }

        const data = await response.json();
        
        if (data.Response === "False"){
            throw new Error(data.error);
        }
        
        setMovies(data.Search);
        
        
    }catch(error){
        console.error(`Error fetching movies: ${error}`);
        return setMovies([]);
    }
  }

  async function handleMovieDetail(imdbId){
    try{
      const response = await fetch(`http://www.omdbapi.com/?apikey=ef0eab7b&i=${imdbId}`);

      if (!response.ok){
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (data.response === "False"){
        throw new Error(data.error);
      }

      setSelectedMovie(data);
      setIsModalOpen(true);


    }catch(error){
      console.error(`Error fetching movie: ${error}`);
      return 0;
    }
  }

  return (
    <>
      <div className="container mt-3">
        <h1>IMDB Movies</h1>

        <SearchBar handleMovieList={handleMovieList}/>

        <div className="row movie-container">
          <div className="row">
            {movies.length > 0 && movies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} onShowDetail={() =>handleMovieDetail(movie.imdbID)}/>
            ))}        
          </div>
        </div>
      </div>


      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="movieDetailModal" 
          aria-labelledby="movieDetailModalLabel" aria-hidden="true"
          style={{display: isModalOpen ? 'block' : 'none'}}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                  <div className="modal-header">
                      <h1 className="modal-title fs-5" id="movieDetailModalLabel">Detail Movie</h1>
                  </div>
                  <div className="modal-body">
                    {isModalOpen && <MovieDetailModal movie={selectedMovie}/>}  
                  </div>
                  <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsModalOpen(false)}>Close</button>
                  </div>
              </div>
          </div>
      </div>            
    </>
  );
}

export default App;