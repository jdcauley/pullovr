/**
 * ViewsController
 *
 * @description :: Server-side logic for managing views
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var parser = require('parse-rss');

module.exports = {

	index: function(req, res){

		Feeds.find().limit(12).exec(function(err, feeds){
			res.view({feeds: feeds});
		});

	},

	show: function(req, res){

		var params = req.params.all();

		Feeds.findOne({id: params.id}).populate('episodes', {limit: 12, sort: 'createdAt DESC' }).exec(function(err, feed){

			res.view({feed: feed});

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
