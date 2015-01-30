/**
 * ViewsController
 *
 * @description :: Server-side logic for managing views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var parser = require('parse-rss');

var twitter = require('simple-twitter');
twitter = new twitter(
	'l9NwxAzJeEWWBWdia7H0xNBPO', //consumer key from twitter api
	'RXQcwbyIqUsePzDOycUtoVZ4S441WKDccEwg2eliIqwiY4CVmz', //consumer secret key from twitter api
	'2976230387-t0u0FtlrqicLtGBU9yfTjChPOGbVMOmY8GS4Z45', //acces token from twitter api
	'tnSK947irBIBMR6A2ANhEEu4oO93u0G10zznzD1rYSz9H', //acces token secret from twitter api
	3600  //(optional) time in seconds in which file should be cached (only for get requests), put false for no caching
);

module.exports = {

	index: function(req, res){

		var feedsQuery = Feeds.find();
		feedsQuery.sort('visits DESC');
		feedsQuery.limit(24);

		var techFeeds = Feeds.find({
			or : [
				{
					description: {
						contains: 'technology'
					}
				},
				{
					keywords: {
						contains: 'technology'
					}
				}
			]
		});
		techFeeds.sort('visits DESC');
		techFeeds.limit(6);

		var newsFeeds = Feeds.find({
			or : [
				{
					description: {
						contains: 'news',
					}
				},
				{
					keywords: {
						contains: 'news',
					}
				}
			]
		});
		newsFeeds.sort('visits DESC');
		newsFeeds.limit(6);

		var movieFeeds = Feeds.find({
			or : [
				{
					description: {
						contains: 'movie',
					}
				},
				{
					keywords: {
						contains: 'movie',
					}
				}
			]
		});
		movieFeeds.sort('visits DESC');
		movieFeeds.limit(6);


		feedsQuery.exec(function(err, feeds){
			if(err){
				sails.log.error(err);
				res.redirect('/');
			}
			if(feeds){
				techFeeds.exec(function(err, tfeeds){
					if(err){
						sails.log.error(err);
						res.view({data:
							{
								popular: feeds,
							}
						});
					}
					if(tfeeds){
						movieFeeds.exec(function(err, mfeeds){
							if(err){
								sails.log.error(err);
								res.view({data:
									{
										popular: feeds,
										tech: tfeeds,
									}
								});
							}
							if(mfeeds){

								newsFeeds.exec(function(err, nfeeds){
									if(err){
										sails.log.error(err);
										res.view({data:
											{
												popular: feeds,
												tech: tfeeds,
												movie: mfeeds
											}
										});
									}
									if(nfeeds){
										res.view({data:
											{
												popular: feeds,
												tech: tfeeds,
												movie: mfeeds,
												news: nfeeds
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	},
	show: function(req, res){

		var params = req.params.all();

		Feeds.findOne({id: params.id}).populate('episodes', {limit: 12, sort: 'createdAt DESC' }).exec(function(err, feed){

			if(err){
				sails.log.error(err);
				req.flash("message", '<h3 class="error">We\'re sorry, there was an error. Please try again.</h3>');
				res.redirect('/');
			}
			if(feed){
				res.view({feed: feed});
			}

			if(feed.visits){
				var feedVisits = feed.visits + 1;
			} else {
				var feedVisits = 1;
			}

			Feeds.update(feed.id, {
				visits: feedVisits
			}, function(err){
				if(err) sails.log.error(err);
			});

		});

	},

	search: function(req, res){

		var params = req.params.all();

		var searchContent = params.search;
		var stringArray = searchContent.split(',');

		var searchFeeds = Feeds.find({
  		or : [
				{
					title: {
						contains: searchContent
					}
				},
				{
					publisher: {
						contains: searchContent
					}
				},
				{
					description: {
						contains: searchContent
					}
				},
				{
					keywords: {
						contains: searchContent
					}
				},
				{
					feed: {
						contains: searchContent
					}
				}
			]
		});

		searchFeeds.populate('episodes', {limit: 1, sort: 'createdAt DESC' });

		searchFeeds.exec(function(err, feeds){
			if(err){
				sails.log.error(err);
				req.flash("message", '<h3 class="error">We\'re sorry, there was an error. Please try again.</h3>');
				res.redirect('/');
			}
			if(feeds.length < 1){

				parser(params.search, function(err, rss) {

					if (err) {
						console.log(err);
						res.view({
							feeds: feeds,
							results: params.search
						});
					}
					if(rss){

						var urlTitle = rss[0].meta.title;

						if(rss[0]['itunes:keywords']){
							var keywords = rss[0]['itunes:keywords']['#'];
						} else {
							var keywords = null
						}

						Feeds.create({
							feed: params.search,
							poster: rss[0].meta.image.url,
							title: rss[0].meta.title,
							urlTitle: urlTitle.replace(/ /g,"-"),
							site: rss[0].meta.link,
							copyright: rss[0].meta.copyright,
							publisher: rss[0].meta.author,
							description: rss[0].meta.description,
							feedUpdated: rss[0].pubDate,
							keywords: keywords,
							categories: rss[0].categories
						}, function(err, created){

							utility.getEpisodes(rss, created.id, function(err, done){
								if(err){
									res.view({
										feeds: feeds,
										results: params.search
									});
								}

								if(done){
									twitter.post('statuses/update',
										{'status' : 'New Podcast, ' + created.title + ' http://pullovr.com/podcast/' + created.id},
										function(err, data) {
											if(err) sails.log.error(err);
										});
									res.redirect('/podcast/' + created.id);
								}

							});

						});

					}

				});

			} else {

				res.view({
					feeds: feeds,
					results: params.search
				});
			}
		});

	}

};
