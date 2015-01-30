var mime = require('mime');
var parser = require('parse-rss');
module.exports = {

  getEpisodes: function(feed, feedId, cb){
    feed.reverse();
    async.eachSeries(feed, function(episode, callback){

      if(episode.enclosures[0]){

        var urlTitle = episode.title
        var urlTitle = urlTitle.replace(/ /g,"-");

        Episodes.findOne({
          primaryEnclosureUrl: episode.enclosures[0].url
        }, function(err, found){
          if(err){
            callback();
          }
          if(found){
            callback();
          } else {

            var enclosureUrl = episode.enclosures[0].url;
            var enclosureStripParams = enclosureUrl.split('?');
            var theEnclosure = enclosureStripParams[0];
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
      if(err){
        cb(err);
      } else {
        cb(null, 'done');
      }
    });
  },

  feedParser: function(feed, feedCB){
    parser(feed.feed, function(err, rss) {
      if(err){
        feedCB(err);
      }
      if(rss){
        utility.getEpisodes(rss, feed.id, function(err, done){
          if(err){
            feedCB(err);
          }
          if(done){
            feedCB(null, done);
          }
        });
      } else {
        feedCB();
      }
    });
  }

};
