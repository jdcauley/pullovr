var mime = require('mime');
module.exports = {

  getEpisodes: function(feed, feedId, cb){
    feed.reverse();

    async.eachSeries(feed, function(episode, callback){

      var urlTitle = episode.title
      var urlTitle = urlTitle.replace(/ /g,"-");

        if(episode.enclosures[0].url){

          Episodes.findOneByPrimaryEnclosureUrl(episode.enclosures[0].url, function(err, found){
            if(err){
              callback();
            }
            if(found){
              callback();
            } else {
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
                  callback();
                }
                if(newEpisode){
                  callback();
                }



              });
            }
          });

        } else {
          callback();
        }

    }, function(err){
      if(err) cb(err);
      if(!err) cb(null, 'done');
    });


  }

};
