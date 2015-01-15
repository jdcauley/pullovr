var mime = require('mime');
module.exports = {

  getEpisodes: function(feed, feedId, cb){

    async.eachSeries(feed, function(episode, callback){

      var urlTitle = episode.title
      var urlTitle = urlTitle.replace(/ /g,"-");


        Episodes.findOne({primaryEnclosureUrl: episode.enclosures[0].url}, function(err, found){
          if(err){
            console.log(err);
          }
          if(found){
            callback();
          } else {
            console.log('new episode');
            var theEnclosure = episode.enclosures[0].url;
            var fileType = mime.lookup(theEnclosure);
            var minusExt = theEnclosure.substr(0, theEnclosure.lastIndexOf('.')) || theEnclosure;

            if(episode['content:encoded']){
              var content = episode['content:encoded']['#'];
            } else {
              var content = null;
            }
            Episodes.create({
              feed: feedId,
              title: episode.title,
              urlTitle: urlTitle,
              extFree: minusExt,
              fileType: fileType,
              description: episode.description,
              summary: episode.summary,
              pubDate: episode.pubDate,
              episodePage: episode.link,
              publisher: episode.author,
              image: episode.image.url,
              primaryEnclosureUrl: episode.enclosures[0].url,
              allEnclosures: episode.enclosures,
              content: content
            }, function(err, newEpisode){
              if(err){
                console.log(err);
                callback();
              }
              if(newEpisode){
                console.log(err);
                callback();
              }



            });
          }
        });

    }, function(err){
      if(err) cb(err);
      if(!err) cb(null, 'done');
    });


  }

};
