/**
 * EpisodesController
 *
 * @description :: Server-side logic for managing episodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var parser = require('parse-rss');

module.exports = {

	index: function(req, res){

		var params = req.params.all();

		var episodesQuery = Episodes.find();

		episodesQuery.sort('created DESC');

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
