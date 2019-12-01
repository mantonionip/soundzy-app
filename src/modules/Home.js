import React, { Fragment } from 'react';
import SearchResult from './SearchResult';
import SongContainer from './SongContainer';
import Header from './Header';

const Home = (props) => {
    return(
        <Fragment>
            <div className="searchPage">
            <Header />
                <form className="wrapper" role="search" aria-labelledby="search" onSubmit={props.handleSubmit}>
                    
                    <div className="country">
                        <label className="select">Select Your Country</label>
                        <ul className="countryInput">
                            <li className="radio">
                                <input
                                    type="radio"
                                    name="userCountry"
                                    id="us"
                                    value="US"
                                    checked={props.userCountry === 'US'}
                                    onChange={props.handleChange}
                                />
                                <label htmlFor="us" className="flag unitedStates"></label>
                            </li>
    
                            <li className="radio">
                                <input
                                    type="radio"
                                    name="userCountry"
                                    id="canada"
                                    value="CA"
                                    checked={props.userCountry === 'CA'}
                                    onChange={props.handleChange}
                                />
                                <label htmlFor="canada" className="flag canada"></label>
                            </li>
    
                            <li className="radio">
                                <input
                                    type="radio"
                                    name="userCountry"
                                    id="united kingdom"
                                    value="GB"
                                    checked={props.userCountry === 'GB'}
                                    onChange={props.handleChange}
                                />
                                <label htmlFor="unitedKingdom" className="flag unitedKingdom"></label>
                            </li>
    
                            <li className="radio">
                                <input
                                    type="radio"
                                    name="userCountry"
                                    id="france"
                                    value="FR"
                                    checked={props.userCountry === 'FR'}
                                    onChange={props.handleChange}
                                />
                                <label htmlFor="france" className="flag france"></label>
                            </li>

                            <li className="radio">
                                <input
                                    type="radio"
                                    name="userCountry"
                                    id="spain"
                                    value="ES"
                                    checked={props.userCountry === 'ES'}
                                    onChange={props.handleChange}
                                />
                                <label htmlFor="spain" className="flag spain"></label>
                            </li>

                            <li className="radio">
                                <input
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

                    <div className="userInput">
                        <label htmlFor="userInput">Enter your favourite artist, music track or genre and discover new music.</label>
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
                            
        
                            <input type="submit" value="Search"/>
                        </div>
                    </div>
                </form>
            </div>

            <div className="search" id="search">
                <div className="wrapper">
                    {props.resultsIsShowing && <SearchResult music={props.music} />}

                    {props.isLoading ? <p>Loaindg...</p> : <SongContainer music={props.music} addSong={props.addSong} audioPlay={props.audioPlay} audioPlaying={props.audioPlaying} />}
                </div>
            </div>
            
        </Fragment>
    )
}

export default Home;