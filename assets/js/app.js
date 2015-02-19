(function(){

  io.socket.on('votes', function(events){
  });


  function submitVote(){
    console.log('click');
    var userVote = this.getAttribute('data-vote');

    var votes = {};
    votes.upVote = 0;
    votes.downVote = 0;

    io.socket.post("/votes/new", {vote: userVote}, function(resData, jwres){

      votes = resData.votes;

      if(votes){
        var downBtn = document.getElementById('js-down-vote');
        downBtn.innerHTML = votes.downVote;
        var upBtn = document.getElementById('js-up-vote');
        upBtn.innerHTML = votes.upVote;
      }

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
