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
  },

  updateFeed: function(params, feedId, callback){

    feeds.update(feedId, params, function(err, feed){
      if(err) return callback(err);

      if(feed) return callback(null, feed);
    });

  },

  votes: function(params, callback){
    console.log(params);

    var feedQuery = Feeds.findOne({id: params.feed});
    var votesQuery = Votes.find({where: {user: params.user, feed: params.feed}});

    votesQuery.exec(function(err, votes){

      if(err) {
        console.log(err)
        return callback(err)
      }

      if(votes){

        console.log('votes: ' + votes);
        if(votes[0].vote == params.vote){
          return callback(null, votes[0]);

        } else {

          Votes.update(votes[0].id, {vote: params.vote}, function(err, updatedVote){

            if(err){
              return callback(err);
            }
            if(updatedVote){
              return callback(null, updatedVote);
            }

          });


        }


      } else {
        console.log('create vote');
        Votes.create({
          feed: params.feed,
          user: params.user,
          vote: params.vote
        }, function(err, done){
          if(err){

            return callback(err);
          }
          if(done){

            feedQuery.exec(function(err, feed){
              if(err) return callback(err);

              if(feed){

                if(params.vote === 'up'){
                  if(feed.upVote){
                    var newUpVote = (feed.upVote + 1);
                  } else {
                    var newUpVote = 1;
                  }


                  console.log(newUpVote);

                  Feeds.update(params.feed, {upVote: newUpVote}, function(err, newFeed){
                    if(err){
                      return callback(err);
                    } else {
                      return callback(null, newFeed);
                    }
                  });

                } else if(params.vote === 'down'){
                  if(feed.downVote){
                    var newDownVote = (feed.downVote + 1);
                  } else {
                    var newDownVote = 1;
                  }

                  console.log(newDownVote);

                  Feeds.update(params.feed, {downVote: newDownVote}, function(err, newFeed){
                    if(err){
                      return callback(err);
                    } else {
                      return callback(null, newFeed);
                    }
                  });

                } else {
                  console.log('no params');
                  return callback({error: 'no params'});
                }

              }

            });
          }

        });
      }
    });
  },


  updateFeedRating: function(rating, callback){
    console.log('updating feed rating');

    var feedQuery = Feeds.findOne({id: rating.feed});

    feedQuery.exec(function(err, feed){
      if(err){
        sails.log.error(err);
      }
      if(feed){

        if(feed.upVotes && feed.downVotes){

          console.log('new rating ' + rating.rating);

          var currentTotal = parseInt(feed.ratingsTotal, 10);
          console.log(currentTotal);
          var sumTotal = parseFloat(currentTotal) * parseFloat(feed.ratingsCount);
          console.log(sumTotal);
          var newCount = (feed.ratingsCount + 1);
          console.log(newCount);
          var newSumTotal = parseFloat(sumTotal) + parseFloat(rating.rating);
          console.log(newSumTotal);
          var newAverage = parseFloat(newSumTotal) / parseFloat(newCount);

          console.log(newAverage);

          Feeds.update(feed.id, {ratingsTotal: newAverage, ratingsCount: newCount}, function(err, done){
            if(err){
              sails.log.error(err);
              return callback(err);
            }
            if(done){
              return callback(null, done);
            }
          });

        } else {

          Feeds.update(feed.id, {ratingsTotal: rating.rating, ratingsCount: 1}, function(err, done){
            if(err) sails.log.error(err);
            return callback(null, done);
          });

        }

      }
    });

  }

};
