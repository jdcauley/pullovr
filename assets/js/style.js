(function(){

  function styleDate(date){

    var formattedDate = moment(date.innerText).format('MMMM Do, YYYY h:mm a');
    if(formattedDate == 'Invalid date'){
      date.innerText = '';
    } else {
      date.innerText = formattedDate;
    }
  }

  var dates = document.getElementsByClassName('episode-pubdate');

  for(var i = 0; i < dates.length; i++){
    styleDate(dates[i]);
  }


})();

io.socket.on("ratings", function(event){
  console.log(event.data);

});

io.socket.post("/ratings/newAsync", { rating: 4 }, function(resData, jwres) {

  console.log(resData);

});
