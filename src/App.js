import React, { Component, Fragment } from 'react';
import './App.css';
// Sweet Alert library obtained from https://github.com/sweetalert2/sweetalert2
import axios from 'axios';
import Swal from 'sweetalert2';
import Home from './components/Home';
import Footer from './components/Footer';
// Jump slow scroll obtained from http://callmecavs.com/jump.js/
import jump from 'jump.js';


class App extends Component {
  state = {
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
  };

  // Binding the input, and setting new values in state
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // Validating user's input
  validate = () => {
    // When user neither chooses iStore nor fills the search bar
    if (this.state.userInput === '' && this.state.userCountry === '') {
      Swal.fire({
        title: 'Warning',
        text: `Choose an iStore AND enter a name`,
        imageUrl: require('./assets/peopleListeningMusic.png'),
        imageWidth: 500,
        imageHeight: 300,
        imageAlt: 'Illustration of people in the subway listening to music',
      });
      return false
    // When user DO NOT chooses the iStore but fills the search bar
    } else if (this.state.userCountry === '' || !this.state.userInput === null) {
      Swal.fire({
        title: 'Warning',
        text: `You should choose an iStore!!`,
        imageUrl: require('./assets/peopleListeningMusic.png'),
        imageWidth: 500,
        imageHeight: 300,
        imageAlt: 'Illustration of people in the subway listening to music',
      });
      return false
    // When user chooses the iStore BUT leaves the search bar blank
    } else if (this.state.userInput === '') {
      Swal.fire({
        title: 'Warning',
        text: `Search for an artist, an album, or a genre!!`,
        imageUrl: require('./assets/peopleListeningMusic.png'),
        imageWidth: 500,
        imageHeight: 300,
        imageAlt: 'Illustration of people in the subway listening to music',
      });
      return false
    // When user chooses the iStore AND fills the search bar
    } else {
      return true;
    }
  }

  // On submitting the form, grab user's inputs and make the call to fetch data
  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    // If the receiving input from the user is valid the results display
    if (isValid) {
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
  }

  // Function to play music tracks
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

  // Function to reset the main page inputed info
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


  // Make axios call when the app component mounts to the iTunes store API and store the default data into state
  // Limiting the results to 10 per request
  getData = (query, location) => {
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

    const { isLoading, resultsIsShowing, userInput, userCountry, music, audioPlaying, selectedSong, selectedArtist, selectedImage, selectedAudioLink } = this.state

    return (
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
    )
  }
}

export default App;