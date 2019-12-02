import React, { Component, Fragment } from 'react';
import './modules/App.css';
import firebase from './firebase';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './modules/Home';
import Footer from './modules/Footer';
import Playlist from './modules/Playlist';
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
        imageWidth: 500,
        imageHeight: 300,
        imageAlt: 'Illustration of people in the subway listening to music',
      });
      return false
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
    } else {
      return true;
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();

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

  // arrayEqual = (arr1, arr2) => {
  //   if (arr1.length !== arr2.length)
  //     return false;
  //   for (var i = arr1.length; i--;) {
  //     if (arr1[i] !== arr2[i])
  //       return false;
  //   }
  //   return true;
  // }

  addSong = mapIndex => {
    const oldSongTitle = [...this.state.songTitle];
    const updatedPlaylist = oldSongTitle.filter( (item, filterIndex) => filterIndex === mapIndex);
    const updatedPlaylistString = updatedPlaylist.toString();

    const oldSongArtist = [...this.state.songArtist];
    const updatedArtist = oldSongArtist.filter( (item, filterIndex) => filterIndex === mapIndex);
    const updatedArtistString = updatedArtist.toString();

    const oldSongImage = [...this.state.songImage];
    const updatedImage = oldSongImage.filter( (item, filterIndex) => filterIndex === mapIndex);
    const updatedImageString = updatedImage.toString();

    const oldSongLink = [...this.state.songAudioLink];
    const updatedLink = oldSongLink.filter( (item, filterIndex) => filterIndex === mapIndex);
    const updatedLinkString = updatedLink.toString();

    const playlistTitleArtist = this.state.playlist.map( (item) => {
      return [item.songTitle, item.songArtist]
    });

    const selectedSongArtist = [updatedPlaylistString, updatedArtistString]

    let acc = [];
    playlistTitleArtist.forEach( (item) => {
      acc.push(this.arrayEqual(item, selectedSongArtist));
    });

      if (acc.includes(true)) {
        Swal.fire({
          title: 'Warning',
          text: `You already have this song in your playlist!`,
          imageUrl: require('./assets/peopleListeningMusic.png'),
          imageWidth: 500,
          imageHeight: 300,
          imageAlt: 'Illustration of people in the subway listening to music',
        });
      } else {
        this.setState({
          selectedSong: updatedPlaylistString,
          selectedArtist: updatedArtistString,
          selectedImage: updatedImageString,
          selectedAudioLink: updatedLinkString
        })
        const dbRef = firebase.database().ref();
        dbRef.push({
          selectedSong: updatedPlaylistString,
          selectedArtist: updatedArtistString,
          selectedImage: updatedImageString,
          selectedAudioLink: updatedLinkString
        });
      }
  }

  removeSong = (songKey) => {
    const dbRef = firebase.database().ref(songKey);
    dbRef.remove();
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

  componentDidMount() {

    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      const data = response.val();
      const updatePlaylist = [];
      for (let item in data) {
        updatePlaylist.push({
          key: item,
          songTitle: data[item].songTitle,
          songArtist: data[item].songArtist,
          songImage: data[item].songImage,
          songAudioLink: data[item].songAudioLink
        });
      }

      this.setState({
        playlist: updatePlaylist
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