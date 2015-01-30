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


// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
//       // Find the user by username. If there is no user with the given
//       // username, or the password is not correct, set the user to `false` to
//       // indicate failure and set a flash message. Otherwise, return the
//       // authenticated `user`.
//       findByUsername(username, function(err, user) {
//         if (err) { return done(null, err); }
//         if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//         crypto.compare(password, user.password, function(response) {
//           if(!response) return done(null, false, { message: 'Invalid Password' }); // error passwords dont compare
//             var returnUser = { username: user.username, createdAt: user.createdAt, id: user.id };
//             return done(null, returnUser, { message: 'Logged In Successfully'} );
//           });
//
//         })
//       });
//     }
//   ));

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:1337/auth/twitter/callback"
},
function(token, tokenSecret, profile, done) {
  User.findOne({twitterId: profile.id}, function(err, localUser){
    if(err) console.log(err);
    if(localUser){
      return done(null, user);
    } else {
      User.create({
        rdioId: profile.id,
        fullName: profile.displayName,
        firstName: profile._json.result.firstName,
        lastName: profile._json.result.lastName,
        url: profile._json.result.url,
        avatar: profile._json.result.icon,
        token: token,
        secret: tokenSecret
      }, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, user)
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
