import React, { Component, Fragment } from 'react';
import './modules/App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './modules/Home';
import Footer from './modules/Footer';
import jump from 'jump.js';

const initialState = {
  noResults: '',
  noCountry: '',
  noOptionSelected: ''
}

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
      isReset: true,
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  validate = () => {
    let noResults = '';
    let noCountry = '';
    let noOptionSelected = '';

    if (this.state.userInput === '' && this.state.userCountry === '') {
      noOptionSelected = 'You should choose a country as well as entering a name'
    } else if (this.state.userCountry === '' || !this.state.userInput === null) {
      noCountry = 'You should choose a country!!'
    } else if (this.state.userInput === '') {
      noResults = `You should either enter an artist's name, an album, or a genre!!`
    }
    
    if (noOptionSelected) {
      this.setState({noOptionSelected});
      return false;
    }

    if (noResults) {
      this.setState({ noResults });
      return false;
    }

    if (noCountry) {
      this.setState({ noCountry });
      return false;
    }

    return true;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      // clear form
      this.setState(initialState);
    }

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

  resetForm = () => {
    this.setState({
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
      isReset: true, 
      noResults: '',
      noCountry: '',
      noOptionSelected: ''
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
          <div className="errorMessage wrapper">
            {this.state.noResults}
            {this.state.noCountry}
            {this.state.noOptionSelected}
          </div>
          {(!this.state.isHidden) ? <button type="reset" onClick={this.resetForm} className="sectionResetButton">Search Again</button> : null}
          {this.state.isHidden ? null : <Footer />}
          </Fragment>
        </Router>
    )
  }
}

export default App;