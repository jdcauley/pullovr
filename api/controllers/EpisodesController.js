/**
 * EpisodesController
 *
 * @description :: Server-side logic for managing episodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var parser = require('parse-rss');

module.exports = {

	fetchAllFeeds: function(req, res){
		console.log('endpoint');
		Feeds.find().exec(function(err, feeds){

			async.eachSeries(feeds, function(feed, callback){

				parser(feed.feed, function(err, rss) {

					utility.getEpisodes(rss, feed.id, function(err, done){
						if(err){
							callback();
						}
						if(done){
							callback();
						}
					});

				});


			}, function(err){
				if(err) console.log(err);
			});

		});
		res.ok();
	},
	
	getFeed: function(req, res){
		
		var params = req.params.all();
		
		var feedQuery = Feeds.findOne({id: params.id});
		
		feedQuery.exec(function(err, feed){
			
			if(err) {
				res.json(err);
			}
			
			if(feed){
				parser(feed.feed, function(err, rss) {

					utility.getEpisodes(rss, params.id, function(err, done){
					
						if(err) res.json(err);
						if(done) res.ok();
					
					});

				});
				
			} else {
				res.json(500);
			}
			
		});
		
		
	},

	index: function(req, res){

		var params = req.params.all();

		var episodesQuery = Episodes.find();

		if(params.offset){
			episodesQuery.skip(params.offset);
		} else {
			episodesQuery.skip(0);
		}
		if(params.count){
			episodesQuery.limit(params.count);
		} else {
			episodesQuery.limit(12);
		}

		episodesQuery.exec(function(err, episodes){
			if(err){
				res.json(err);
			}
			if(episodes){
				res.json({
					episodes: episodes
				});
			}
		})
	}

};
