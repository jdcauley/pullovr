/**
 * VotesController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function(req, res){

		var params = req.params.all();

		if(req.session.passport.user && req.session.feed && params.vote){

			utility.votes({
				vote: params.vote,
				user: req.session.passport.user,
				feed: req.session.feed},
			function(err, feed){
				if(err) res.json(err);
				if(feed){
					res.json({
						votes: {
							upVote: feed[0].upVote,
							downVote: feed[0].downVote
						}
					});
				}

			});

		} else {

			res.json({error: 'missing params'});

		}

	}

};
