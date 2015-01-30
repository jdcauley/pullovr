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
