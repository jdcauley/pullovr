(function(){

  io.socket.on("ratings", function(event){
    console.log(event.data);

  });

  io.socket.post("/ratings/new", { rating: 5}, function(resData, jwres) {

    console.log(resData);

  });

})();
