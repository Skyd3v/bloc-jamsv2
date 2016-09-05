var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	}
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
		formats: [ 'mp3' ],
		preload: true
	});
	
	setvolume(currentVolume);
};

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]')
};


var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
	
var clickHandler = function() {
		var songItem = parseInt($(this).attr('data-song-number'));
		
		if (currentlyPlayingSongNumber !== null) {
        	// Revert to song number for currently playing song because user started playing new song.
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== songItem) {
			$(this).html(pauseButtonTemplate); 
            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
		} else if (currentlyPlayingSongNumber === songItem) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton);
				currentSoundFile.play();
			} else {
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.pause();
			}
	    }
	};
	
var onHover = function(event) {
		var songItem =$(this).find('.song-item-number');
		var songItemNumber = parseInt(songItem.attr('data-song-number'));
		
		if (songItemNumber !== currentlyPlayingSongNumber) {
			songItem.html(playButtonTemplate);
		}
	};
	
var offHover = function(event) {
		var songItem = $(this).find('.song-item-number');
		var songItemNumber = parseInt(songItem.attr('data-song-number'));
		
		if (songItemNumber !== currentlyPlayingSongNumber) {
			songItem.html(songItemNumber);
		}
	};
	
	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	
	return $row;
};



var setCurrentAlbum = function(album) {
	
	currentAlbum = album;
     
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     
     $albumSongList.empty();
 
    
     for (i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
		 $albumSongList.append($newRow);
     }
 };

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);
	currentSoundFile.play();
    

    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
	var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
	
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex--;
	
	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length - 1;
	}
	
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	
	updatePlayerBarSong();
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	
	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
	
	
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {
	var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
	if (currentSoundFile.isPaused()) {
		$currentlyPlayingCell.html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play();
	} else if (currentSoundFile) {
		$currentlyPlayingCell.html(playButtonTemplate);
		$(this).html(playerBarPlayButton);
		currentSoundFile.pause();
	}
};


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainPlayPause = $('.main-controls .play-pause');



$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
	 $previousButton.click(previousSong);
	 $nextButton.click(nextSong);
	 $mainPlayPause.click(togglePlayFromPlayerBar);
	 
 });