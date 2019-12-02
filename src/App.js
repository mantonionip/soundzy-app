import React, { Component, Fragment } from 'react';
import './modules/App.css';
import firebase from './firebase';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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
      audioPlaying: [],
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

    if (this.state.userInput === '' && this.state.userCountry === '') {
      Swal.fire({
        title: 'Warning',
        text: `Choose a country AND enter a name`,
        imageUrl: require('./assets/peopleListeningMusic.png'),
        imageWidth: 500,
        imageHeight: 300,
        imageAlt: 'Illustration of people in the subway listening to music',
      });
      return false
    } else if (this.state.userCountry === '' || !this.state.userInput === null) {
      Swal.fire({
        title: 'Warning',
        text: `You should choose a country!!`,
        imageUrl: require('./assets/peopleListeningMusic.png'),
        imageWidth: 400,
        imageHeight: 200,
        // imageAlt: 'Custom image',
      });
      return false
      // noCountry = `You should choose a country!!`
    } else if (this.state.userInput === '') {
      Swal.fire({
        title: 'Warning',
        text: `You should either enter an artist's name, an album, or a genre!!`,
        imageUrl: require('./assets/peopleListeningMusic.png'),
        imageWidth: 400,
        imageHeight: 200,
        // imageAlt: 'Custom image',
      });
      return false
      // noResults = `You should either enter an artist's name, an album, or a genre!!`
    } else {
      return true;
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    console.log(isValid);
    if (isValid) {

      // clear form

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

      const dbRef = firebase.database().ref();
      dbRef.push('text');
    }  
  }

  audioPlay = (mapIndex) => {
    const audio = document.getElementById(mapIndex);
    const allAudios = document.querySelectorAll('audio');
    const audioArray = [...this.state.audioPlaying];

    audio.onended = (event) => {
      audioArray[mapIndex] = false
      this.setState({
        audioPlaying: audioArray
      })
    }
    if (audioArray[mapIndex]) {
      audioArray[mapIndex] = !audioArray[mapIndex]
      console.log(audioArray[mapIndex]);
      audio.pause();
      this.setState({
        audioPlaying: audioArray
      })
    } else {
      audioArray[mapIndex] = !audioArray[mapIndex]
      allAudios.forEach((singleAudio, index) => {
        if (index !== mapIndex) {
          singleAudio.pause();
          audioArray[index] = false
        } 
      })
      audio.play();
      this.setState({
        audioPlaying: audioArray
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
      const isAudioPlaying = [];
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
        isAudioPlaying.push(false);
        return item.previewUrl
      })

      this.setState({
        music: data,
        isLoading: false,
        songTitle: songTitle,
        songArtist: songArtist,
        songImage: songImage,
        songAudioLink: songAudioLink,
        audioPlaying: isAudioPlaying
      })
    })
  }
 
  render() {

    const { isLoading, resultsIsShowing, userInput, userCountry, music, playlist, audioPlaying, selectedSong, selectedArtist, selectedImage, selectedAudioLink } = this.state

    return (
        <Router>
          <Fragment>
            <div className="errorMessage wrapper">
              {this.state.noResults}
              {this.state.noCountry}
              {this.state.noOptionSelected}
            </div>
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