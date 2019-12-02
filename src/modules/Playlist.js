import React, { Fragment } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
library.add(faTimesCircle);

const Playlist = (props) => {
    return(
        <Fragment>
            <div className="playListContainer">
                <div className="wrapper">
                    <div className="playlist">
                        <h2>Your Curated Playlist</h2>
                        <h3>Click on the covers below to preview your favourite track</h3>
                    </div>
                    <ul className="playlist">
                        <li>
                            <p className="image"></p>
                            <p className="title">title</p>
                            <p className="artist">artist</p>
                            <button></button>
                        </li>
                        { props.playlist.map((item, mapIndex) => {
                            return (
                                <li key={item.key}>
                                    <div className="image">

                                        <input type="image" src={item.songImage} alt={item.songTitle} onClick={() => { props.audioPlay(mapIndex)}} />
                                        <div className="play">
                                            { props.audioPlaying ? <FontAwesomeIcon icon="pause-circle" /> : <FontAwesomeIcon icon="play-circle" />}
                                        </div>
                                    </div>
                                    <audio src={item.songAudioLink} id={mapIndex} type="audio/m4a">Your browser does not support the <code>audio</code> element.</audio>
                                    <p className="title">{item.songTitle}</p>
                                    <p className="artist">{item.songArtist}</p>
                                    <button onClick={() => { props.removeSong(item.key) }}><FontAwesomeIcon icon="times-circle" /><span class="sr-only">remove song from the playlist</span></button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </Fragment>
    )
}

export default Playlist;