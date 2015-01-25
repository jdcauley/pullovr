/**
 * ViewsController
 *
 * @description :: Server-side logic for managing views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var parser = require('parse-rss');

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
			techFeeds.exec(function(err, tfeeds){
				movieFeeds.exec(function(err, mfeeds){
					newsFeeds.exec(function(err, nfeeds){

						res.view({data:
							{
								popular: feeds,
								tech: tfeeds,
								movie: mfeeds,
								news: nfeeds
							}
						});

					});
				});
			});
		});

	},
	show: function(req, res){

		var params = req.params.all();

		Feeds.findOne({id: params.id}).populate('episodes', {limit: 12, sort: 'createdAt DESC' }).exec(function(err, feed){

			res.view({feed: feed});

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
				res.json(err);
			}
			if(feeds.length < 1){

				parser(params.search, function(err, rss) {

					if (err) {
						res.view({
							err: err,
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
									res.redirect('/podcast/' + created.id);
								}

							});

						});

					} else {

						res.view({
							feeds: feeds,
							results: params.search
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
