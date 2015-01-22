(function() {

  videojs.plugin('playlist', function(options) {

    console.log(this);
    var id = this.el().id;

    var tracks = document.querySelectorAll("#"+id+"-vjs-playlist .vjs-track"),

    trackCount = tracks.length,
    player = this,
    currentTrack = tracks[0],
    index = 0,
    play = true,
    onTrackSelected = options.onTrackSelected;

    //manually selecting track
    for(var i=0; i<trackCount; i++){
      tracks[i].onclick = function(){
        trackSelect(this);
      }
    }

    // for continuous play
    if(typeof options.continuous=='undefined' || options.continuous==true){

      player.on("ended", function(){

        index++;
        if(index >= trackCount){
          index=0;
        } else;
        tracks[index].click();

      });
    }
    else;

    var trackSelect = function(track){

      var src = track.getAttribute('data-src');
      var fileType = track.getAttribute('data-type');
      var poster = track.getAttribute('data-poster');
      console.log(poster);
      index = parseInt(track.getAttribute('data-index')) || index;

      player.src({ type: fileType, src: src, poster: poster });
      console.log(player);
      if(play) player.play();

//remove 'currentTrack' CSS class
      for(var i=0; i<trackCount; i++){
        if(tracks[i].classList.contains('currentTrack')){
          tracks[i].className=tracks[i].className.replace(/\bcurrentTrack\b/,'nonPlayingTrack');
        }
      }
//add 'currentTrack' CSS class
      track.className = track.className + " currentTrack";
      if(typeof onTrackSelected === 'function') onTrackSelected.apply(track);

    }

//if want to start at track other than 1st track
if(typeof options.setTrack!='undefined' ){
  options.setTrack=parseInt(options.setTrack);
  currentTrack=tracks[options.setTrack];
  index=options.setTrack;
  play=false;
  //console.log('options.setTrack index'+index);
  trackSelect(tracks[index]);
  play=true;
}

var data={
  tracks: tracks,
  trackCount: trackCount,
  play:function(){
    return play;
  },
  index:function(){
    return index;
  },
  prev:function(){
    var j=index-1;
    //console.log('j'+j);
    if(j<0 || j>trackCount) j=0;
    trackSelect(tracks[j]);
  },
  next:function(){
    var j=index+1;
    //console.log('j'+j);
    if(j<0 || j>trackCount) j=0;
    trackSelect(tracks[j]);
  }
};
return data;
});
//return videojsplugin;
})();
