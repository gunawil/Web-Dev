import { useState } from "react";
import MovieCard from "./MovieCard";

function SearchBar({handleMovieList}){
  const [keyword, setKeyword] = useState('');

  function handleInputChange(e){
    setKeyword(e.target.value);
  }

  function handleSearch(){
    handleMovieList(keyword);
  }

  return (
      <div className="row">
        <div className="col-md">
          <div className="input-group">
            <input type="text" className="form-control" placeholder='Search Movies...' onChange={handleInputChange}></input>
            <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
  );
}

export default SearchBar;