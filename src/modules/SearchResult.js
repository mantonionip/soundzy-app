import React from 'react';

const SearchResult = (props) => {
    return (
        <div className="searchResult">
            <h3>Click on the album covers and listen to the preview of each track</h3>
            <p>Your search returned {props.music.length} results</p>
        </div>
    )
}

export default SearchResult;