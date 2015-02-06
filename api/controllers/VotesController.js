/**
 * VotesController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	new: function(req, res){

		var params = req.params.all();

		console.log(params.vote);
		console.log('user id: ' + req.session.passport.user);
		console.log(req.isSocket);

		if(req.session.passport.user && req.session.feed && params.vote){

			utility.votes({
				vote: params.vote,
				user: req.session.passport.user,
				feed: req.session.feed},
			function(err, feed){
				if(err) res.json(err);
				if(feed) res.json({feed: feed});

			});

		} else {

			res.json({error: 'missing params'});

		}

	}

};
