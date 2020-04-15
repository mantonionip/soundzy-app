import React, { Component } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
library.add(faPlusCircle, faPlayCircle, faPauseCircle)

const SongContainer = (props) => (
    // The values each track needs to have on the result page
    <div className="songContainer" aria-live="polite" role="main">
        {props.music.map((item, mapIndex) => {
            const {
                trackName,
                trackId,
                artistName,
                artistViewUrl,
                artworkUrl100: artwork,
                collectionName,
                previewUrl,
            } = item;
            // Every single item in the result page
            return (
                <div className="musicItem" key={trackId}>
                    <div className="image">
                        <input className="artwork" type="image" src={artwork} alt={collectionName} onClick={() => { props.audioPlay(mapIndex) }} />
                        <div onClick={() => { props.audioPlay(mapIndex) }} className="play">{ props.audioPlaying[mapIndex] ? <FontAwesomeIcon icon="pause-circle" /> : <FontAwesomeIcon icon="play-circle" /> }</div>
                    </div>

                    <h3 className="trackName">{trackName}</h3>
                    <h4 className="artist"><a href={artistViewUrl}>{artistName}</a></h4>
                    <audio id={mapIndex} src={previewUrl} type="audio/m4a">Your browser does not support the <code>audio</code> element.</audio>
                </div>
            )
        })}
    </div>
);

export default SongContainer;