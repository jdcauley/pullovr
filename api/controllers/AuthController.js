/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');

module.exports = {

	twitter: function(req, res){
		passport.authenticate('twitter', function (err, user) {
			req.logIn(user, function (err) {
				if(err) {
					console.log(err);
					res.view('500');
					return;
				}
				res.redirect('/?authed-to-twitter=true');
				return;
			});
		})(req, res);
	},

	logout: function(req, res){
		req.logout();
		res.redirect('/?logged-out=true')
	}

};
