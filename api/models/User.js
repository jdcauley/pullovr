/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    reviews: {
      collection: 'reviews',
      via: 'user'
    },
    twitterId: {
      type: 'string'
    },
    twitterUsername: {
      type: 'string'
    },
    twitterName: {
      type: 'string'
    },
    twitterAvatar: {
      type: 'string'
    },
    twitterToken: {
      type: 'string'
    },
    twitterSecret: {
      type: 'string'
    }

  }
};
