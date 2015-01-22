(function(){

  function styleDate(date){

    var formattedDate = moment(date.innerText).format('MMMM Do, YYYY h:mm a');
    date.innerText = formattedDate;
  }

  var dates = document.getElementsByClassName('episode-pubdate');

  for(var i = 0; i < dates.length; i++){
    styleDate(dates[i]);
  }


})();
