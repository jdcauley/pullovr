/**
 * FeedsController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var parser = require('parse-rss');

module.exports = {

	create: function(req, res){

		var params = req.params.all();

		parser(params.url, function(err, rss) {
			if (err) {
				res.json(err);
			}
			Feeds.findOne({feed: params.url}, function(err, feed){

				if(rss[0]['itunes:keywords']){
					var keywords = rss[0]['itunes:keywords']['#'];
				} else {
					var keywords = null
				}

				if(!feed){
					Feeds.create({
						feed: params.url,
						poster: rss[0].meta.image.url,
						title: rss[0].meta.title,
						urlTitle: rss[0].meta.title.replace(/ /g,"-"),
						site: rss[0].meta.link,
						copyright: rss[0].meta.copyright,
						publisher: rss[0].meta.author,
						description: rss[0].meta.description,
						feedUpdated: rss[0].pubDate,
						keywords: keywords,
						categories: rss[0].categories
					}, function(err, created){

						utility.getEpisodes(rss, created.id, function(err, done){
							res.redirect('/');
						});

					});
				} else {
					res.redirect('/');
				}
			})
		});
	},

	fetch: function(req, res){

		var params = req.params.all();

		if(params.key === 'wfhyhItyukVAcRgEh8SmQg9CpgG'){

			var fetch = Feeds.find();


			fetch.exec(function(err, feeds){
				if(err) res.json(err);
				if(feeds){

					async.each(feeds, function(feed, callback){

						parser(feed.feed, function(err, rss) {
							if(err){
								callback();
							}
							if(rss && (feed.feedUpdated != rss[0].pubDate)){

								if(rss){
									utility.getEpisodes(rss, created.id, function(err, done){
										if(err){
											callback(err);
										}
										if(done){
											callback();
										}
									});
								}

							} else {
								callback();
							}

						});

					}, function(err){
						if(err){
							res.json(err);
						} else {
							res.ok();
						}
					});
				}

			});

		} else {

			res.json('disallowed');

		}


	},

	index: function(req, res){

		var params = req.params.all();

		var feedsQuery = Feeds.find();
		feedsQuery.populate('episodes');

		if(params.offset){
			feedsQuery.skip(params.offset);
		} else {
			feedsQuery.skip(0);
		}
		if(params.count){
			feedsQuery.limit(params.count);
		} else {
			feedsQuery.limit(12);
		}

		feedsQuery.exec(function(err, feeds){
			if(err){
				res.json(err);
			}
			if(feeds){
				res.json({
					feeds: feeds
				});
			}
		});
	}

};
