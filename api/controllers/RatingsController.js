/**
 * RatingsController
 *
 * @description :: Server-side logic for managing ratings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function(req, res){

		var params = req.params.all();

		console.log(params);
		console.log('user id: ' + req.session.passport.user);
		console.log(req.isSocket);

		Ratings.create({
			user: req.session.passport.user,
			feed: req.session.feed,
			rating: params.rating,
		}, function(err, newRating){
			if(err){
				sails.log.error(err);
				res.json(err);
			}
			if(newRating){
				console.log(newRating);
				utility.updateFeedRating(newRating, function(err, newFeed){
					if(err){
						res.json(err);
					} else {
						res.json({feed: newFeed});
					}
				});

			}

		});

	}


};
