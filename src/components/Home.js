import React, { Fragment } from 'react';
import SearchResult from './SearchResult';
import SongContainer from './SongContainer';
import Header from './Header';

const Home = (props) => (
    <Fragment>
        <div className="searchPage">
            <Header />
            {/* Defining six countries iStores by iTunes store */}
            <form className="wrapper" role="search" aria-labelledby="search" onSubmit={props.handleSubmit}>
                <div className="country">
                    <label className="select">Select Your iStore:</label>
                    <ul className="countryInput">
                        {/* Unites States Store */}
                        <li className="radio">
                            <input
                                className="hide"
                                type="radio"
                                name="userCountry"
                                id="us"
                                value="US"
                                checked={props.userCountry === 'US'}
                                onChange={props.handleChange}
                            />
                            <label htmlFor="us" className="flag unitedStates"></label>
                        </li>
                        {/* Canada Store */}
                        <li className="radio">
                            <input
                                className="hide"
                                type="radio"
                                name="userCountry"
                                id="canada"
                                value="CA"
                                checked={props.userCountry === 'CA'}
                                onChange={props.handleChange}
                            />
                            <label htmlFor="canada" className="flag canada"></label>
                        </li>
                        {/* Great Britain Store */}
                        <li className="radio">
                            <input
                                className="hide"
                                type="radio"
                                name="userCountry"
                                id="unitedKingdom"
                                value="GB"
                                checked={props.userCountry === 'GB'}
                                onChange={props.handleChange}
                            />
                            <label htmlFor="unitedKingdom" className="flag unitedKingdom"></label>
                        </li>
                        {/* France Store */}
                        <li className="radio">
                            <input
                                className="hide"
                                type="radio"
                                name="userCountry"
                                id="france"
                                value="FR"
                                checked={props.userCountry === 'FR'}
                                onChange={props.handleChange}
                            />
                            <label htmlFor="france" className="flag france"></label>
                        </li>
                        {/* Spain Store */}
                        <li className="radio">
                            <input
                                className="hide"
                                type="radio"
                                name="userCountry"
                                id="spain"
                                value="ES"
                                checked={props.userCountry === 'ES'}
                                onChange={props.handleChange}
                            />
                            <label htmlFor="spain" className="flag spain"></label>
                        </li>
                        {/* Italy Store */}
                        <li className="radio">
                            <input
                                className="hide"
                                type="radio"
                                name="userCountry"
                                id="italy"
                                value="IT"
                                checked={props.userCountry === 'IT'}
                                onChange={props.handleChange}
                            />
                            <label htmlFor="italy" className="flag italy"></label>
                        </li>

                    </ul>
                </div>
                {/* Search bar letting user to search for their favourite music artist, genre and album */}
                <div className="userInput">
                    <label htmlFor="userInput">Search your favourites and find out your true music personality</label>
                    <div className="searchBar">
                        <input
                            type="text"
                            id="userInput"
                            name="userInput"
                            value={props.userInput}
                            onChange={props.handleChange}
                            placeholder="Search for Artist, Song, or Genre"
                            autoComplete="off"
                        />
                        <input className="submitButton" type="submit" value="Search" />
                    </div>
                </div>
            </form>
        </div>
        {/* Displaying the result */}
        <div className="search" id="search">
            <div className="wrapper">
                {props.resultsIsShowing && <SearchResult music={props.music} />}

                {props.isLoading ? <p>Loading...</p> : <SongContainer music={props.music} addSong={props.addSong} audioPlay={props.audioPlay} audioPlaying={props.audioPlaying} />}
            </div>
        </div>
    </Fragment>
);

export default Home;