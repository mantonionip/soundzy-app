import React, { Component, Fragment } from 'react';
import './modules/App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Nav from './modules/Nav';
import Home from './modules/Home';
import Footer from './modules/Footer';

import jump from 'jump.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      resultsIsShowing: false,
      userInput: '',
      userCountry: '',
      music: [],
      songTitle: [],
      songArtist: [],
      songImage: [],
      songAudioLink: [],
      playlist: [],
      selectedSong: '',
      selectedArtist: '',
      selectedImage: '',
      selectedAudioLink: '',
      audioPlaying: false,
      songList: [],
      isHidden: true, 
      isReset: true  
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    jump('.songContainer', {
      duration: 1500,
      offset: 0,
      callback: undefined,
      a11y: true
    });
    this.setState({
      userInput: '',
      isLoading: true,
      resultsIsShowing: true,
      isHidden: false
    })
    const userCountry = this.state.userCountry;
    const userSearch = this.state.userInput;
    this.getData(userSearch, userCountry);
  }

  audioPlay = (mapIndex) => {
    const audio = document.getElementById(mapIndex);
    audio.onended = (event) => {
      this.setState({
        audioPlaying: false
      })
    }
    if (this.state.audioPlaying) {
      audio.pause();
      this.setState({
        audioPlaying: false
      })
    } else {
      audio.play();
      this.setState({
        audioPlaying: true
      })
    }
  }

 /*  arrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length)
      return false;
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i])
        return false;
    }
    return true;
  } */

  // addSong = mapIndex => {
  //   const oldSongTitle = [...this.state.songTitle];
  //   const updatedPlaylist = oldSongTitle.filter( (item, filterIndex) => filterIndex === mapIndex);
  //   const updatedPlaylistString = updatedPlaylist.toString();

  //   const oldSongArtist = [...this.state.songArtist];
  //   const updatedArtist = oldSongArtist.filter( (item, filterIndex) => filterIndex === mapIndex)
  //   const updatedArtistString = updatedArtist.toString();

  //   const oldSongImage = [...this.state.songImage];
  //   const updatedImage = oldSongImage.filter((item, filterIndex) => filterIndex === mapIndex)
  //   const updatedImageString = updatedImage.toString();

  //   const oldSongLink = [...this.state.songAudioLink];
  //   const updatedLink = oldSongLink.filter((item, filterIndex) => filterIndex === mapIndex)
  //   const updatedLinkString = updatedLink.toString();

  //   const playlistTitleArtist = this.state.playlist.map( (item) => {
  //     return [item.songTitle, item.songArtist]
  //   });

  //   const selectedSongArtist = [updatedPlaylistString, updatedArtistString]

  //   let acc = [];

  //   playlistTitleArtist.forEach( (item) => {
  //     acc.push(this.arrayEqual(item, selectedSongArtist));
  //   });
  // }

  resetForm = () => {
    this.setState({
      isLoading: false,
      resultsIsShowing: false,
      userInput: '',
      userCountry: 'US',
      music: [],
      songTitle: [],
      songArtist: [],
      songImage: [],
      songAudioLink: [],
      playlist: [],
      selectedSong: '',
      selectedArtist: '',
      selectedImage: '',
      selectedAudioLink: '',
      audioPlaying: false,
      songList: [],
      isHidden: true,
      isReset: true  
    })
  }

  getData = (query, location) => {
    // make a call to the iTunes store API
    axios({
      url: 'https://itunes.apple.com/search',
      method: 'GET',
      responseType: 'json',
      params: {
        term: query,
        country: location,
        limit: 10,
        media: 'music',
      }
    }).then((res) => {
      // console.log(res.data.results);

      const data = res.data.results;
      const songTitle = data.map((item) => {
        return item.trackName;
      });
      const songArtist = data.map((item) => {
        return item.artistName;
      });
      const songImage = data.map((item) => {
        return item.artworkUrl100;
      })
      const songAudioLink = data.map((item) => {
        return item.previewUrl
      })

      if(data.length === 10) {this.setState({error:'NO RESULTS'})}

      this.setState({
        music: data,
        isLoading: false,
        songTitle: songTitle,
        songArtist: songArtist,
        songImage: songImage,
        songAudioLink: songAudioLink,
      })
    })
  }
 
  render() {

    const { isLoading, resultsIsShowing, userInput, userCountry, music, playlist, audioPlaying, selectedSong, selectedArtist, selectedImage, selectedAudioLink } = this.state

    return (
        <Router>
          <Fragment>
            <Home
              audioPlaying={audioPlaying}
              isLoading={isLoading}
              music={music}
              resultsIsShowing={resultsIsShowing}
              selectedSong={selectedSong}
              selectedArtist={selectedArtist}
              selectedImage={selectedImage}
              selectedAudioLink={selectedAudioLink}
              userInput={userInput}
              userCountry={userCountry}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              addSong={this.addSong}
              audioPlay={this.audioPlay}
            />
          {(!this.state.isHidden) ? <button type="reset" onClick={this.resetForm} className="sectionResetButton">Search Again</button> : null}
          {this.state.isHidden ? null : <Footer />}
          </Fragment>
        </Router>
    )
  }
}

export default App;

