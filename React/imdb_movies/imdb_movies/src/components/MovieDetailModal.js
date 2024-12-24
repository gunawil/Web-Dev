import { useState } from "react";

function MovieDetailModal({movie}){
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <img src={movie.Poster} className="img-fluid"/>
                </div>
                <div className="col-md">
                    <ul className="list-group">
                        <li className="list-group-item"><h4>Title: {movie.Title}</h4></li>
                        <li className="list-group-item"><strong>Director: </strong>{movie.Director}</li>
                        <li className="list-group-item"><strong>Actors: </strong>{movie.Actors}</li>
                        <li className="list-group-item"><strong>Writer: </strong>{movie.Writer}</li>
                        <li className="list-group-item"><strong>Plot: </strong><br/>{movie.Plot}</li>
                    </ul>
                </div>
            </div>
        </div>
        )
}

export default MovieDetailModal;