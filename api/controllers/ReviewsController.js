/**
 * ReviewsController
 *
 * @description :: Server-side logic for managing reviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create: function(req, res){

		var params = req.params.all();

		if(params.rating > 5){
			params.rating = 5;
		}
		if(params.rating < 1){
			params.rating = 1;
		}

		Reviews.create({
			user: req.user.id,
			feed: req.session.feed,
			rating: params.rating,
			title: params.title,
			review: params.review,
		}, function(err, review){
			if(err){
				sails.log.error(err);
				req.flash("message", '<h3 class="error">We\'re sorry, there was an error. Please try again.</h3>');
				res.redirect('/podcast/' + req.session.feed)
			}
			if(review){
				res.redirect('/podcast/' + req.session.feed);
			}

		});

	}

};
