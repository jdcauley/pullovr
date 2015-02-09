(function(){

  // io.socket.on("ratings", function(event){
  //   console.log(event.data);
  //
  // });
  //
  // io.socket.post("/ratings/new", { rating: 5}, function(resData, jwres) {
  //
  //   console.log(resData);
  //
  // });


  io.socket.on('votes', function(events){
    console.log(event.data);
  });


  function submitVote(){

    console.log(this);

    var userVote = this.getAttribute('data-vote');

    console.log(userVote);

    io.socket.post("/votes/new", {vote: userVote}, function(resData, jwres){
      
      console.log(resData);
    });

  }
  function voteWatch(){

    var votes = document.getElementsByClassName('js-vote');
    if(votes){
      for(var i = 0; i < votes.length; i++){

        votes[i].addEventListener('click', submitVote, false);

      }
    }

  }
  voteWatch();



})();
