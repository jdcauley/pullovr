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

		if(params.rating > 5){
			params.rating = 5;
		}
		if(params.rating < 1){
			params.rating = 1;
		}

		Ratings.create({
			user: req.user.id,
			feed: req.session.feed,
			rating: params.rating,
		}, function(err, newRating){
			if(err){
				sails.log.error(err);
				req.flash("message", '<h3 class="error">We\'re sorry, there was an error. Please try again.</h3>');
				res.redirect('/podcast/' + req.session.feed);
			}
			if(newRating){
				console.log(newRating);
				utility.updateFeedRating(newRating, function(err){
					if(err){
						req.flash("message", '<h3 class="error">We\'re sorry, there was an error. Please try again.</h3>');
						res.redirect('/podcast/' + req.session.feed);
					} else {
						res.redirect('/podcast/' + req.session.feed);
					}
				});

			}

		});

	}

};
