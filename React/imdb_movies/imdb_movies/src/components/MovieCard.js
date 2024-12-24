import { useState } from "react";

function MovieCard({movie, onShowDetail}){
    return (
        <div className="col-md-4 my-3">
            <div className="card">
                <img src={movie.Poster} className="card-img-top rounded"></img>
                <div className="card-body">
                    <h5 className="card-title" title={movie.Title}>{movie.Title}</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{movie.Year}</h6>
                    <a href="#" className="btn btn-primary modal-detail-button" 
                    data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="{movie.imdbID}"
                    onClick={() => onShowDetail(movie.imdbID)}>Show Detail</a>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;