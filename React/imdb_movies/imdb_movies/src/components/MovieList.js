import { useState } from "react";

async function MovieList(keyword='avenger'){
    try{
        keyword = (!keyword) ? 'avenger': keyword;

        const response = await fetch(`http://www.omdbapi.com/?apikey=ef0eab7b&s=${keyword}`)
        
        if (!response.ok){
            throw new Error(response.statusText);
        }

        const data = await response.json();
        
        if (data.Response === "False"){
            throw new Error(data.error);
        }
        return data.Search;
    }catch(error){
        console.error(`Error fetching movies: ${error}`);
        return [];
    }

}

export default MovieList