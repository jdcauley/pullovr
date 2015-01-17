var mime = require('mime');
var parser = require('parse-rss');
module.exports = {

  getEpisodes: function(feed, feedId, cb){
    console.log('getting episodes');
    feed.reverse();
    async.eachSeries(feed, function(episode, callback){
      console.log(episode.pubDate);
      var urlTitle = episode.title
      var urlTitle = urlTitle.replace(/ /g,"-");
      console.log(episode.enclosures[0].url);
      Episodes.findOne({
        primaryEnclosureUrl: episode.enclosures[0].url
      }, function(err, found){
        console.log(found);
        if(err){
          console.log(err);
          callback();
        }
        if(found){
          callback();
        } else {
          console.log('new episode');
          var theEnclosure = episode.enclosures[0].url;
          var fileType = mime.lookup(theEnclosure);
          var minusExt = theEnclosure.substr(0, theEnclosure.lastIndexOf('.')) || theEnclosure;
          console.log(episode.title);

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
            } else {
              console.log('no err');
              callback();
            }
            if(newEpisode){
              console.log(newEpisode.id);
              callback();
            }


          });
        }
      });

    }, function(err){

      if(err){
        console.log(err);
        cb(err);
      } else {
        cb(null, 'done');
      }

    });


  },

  feedParser: function(feed, feedCB){
    console.log('parser');
    parser(feed.feed, function(err, rss) {
      if(err){
        console.log(err);
      }
      if(rss){
        console.log('to getEpisdoes');
        console.log(rss);
        utility.getEpisodes(rss, feed.id, function(err, done){
          console.log('send to getEpisodes');
          if(err){
            feedCB(err);
          }
          if(done){
            feedCB();
          }
        });


      } else {
        feedCB();
      }

    });

  }

};
