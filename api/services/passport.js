var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

// helper functions
function findById(id, fn) {
  User.findOne({id: id}, function(err, user){
    if (err){
      return fn(null, null);
    }else{
      return fn(null, user);
    }
  });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(new TwitterStrategy({
  consumerKey: 'l9NwxAzJeEWWBWdia7H0xNBPO',
  consumerSecret: 'RXQcwbyIqUsePzDOycUtoVZ4S441WKDccEwg2eliIqwiY4CVmz',
  callbackURL: "http://localhost:1338/auth/twitter/"
},
function(token, tokenSecret, profile, done) {
  User.findOne({twitterId: profile.id}, function(err, user){
    if(err) console.log(err);
    if(user){
      return done(null, user);
    } else {

      var imageUrl = profile._json.profile_image_url_https;

      var splitUnder = imageUrl.split('_');
      var splitExt = splitUnder[2].split('.');
      splitUnder[0] = splitUnder[0] + '_';
      splitUnder[2] = '_400x400.' + splitExt[1];

      var imageUrl = splitUnder.join('');

      User.create({
        twitterId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: imageUrl,
        raw: profile._json,
        token: token,
        secret: tokenSecret
      }, function(err, newUser){
        if(err){
          return done(err);
        }
        if(newUser){
          return done(null, newUser)
        }
      })
    }
  })
}
));


/**
* Login Required middleware.
*/

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
* Authorization Required middleware.
*/

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if (_.findWhere(req.user.tokens, { kind: provider })) next();
  else res.redirect('/auth/' + provider);
};
