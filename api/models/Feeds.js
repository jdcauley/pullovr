/**
* Feeds.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    episodes: {
      collection: 'episodes',
      via: 'feed'
    },
		feed: {
			type: 'string',
			defaultsTo: null
		},
		poster: {
			type: 'string',
			defaultsTo: null
		},
		title: {
			type: 'string',
			defaultsTo: null
		},
		urlTitle: {
			type: 'string',
			defaultsTo: null
		},
		site: {
			type: 'string',
			defaultsTo: null
		},
		copyright: {
			type: 'string',
			defaultsTo: null
		},
		publisher: {
			type: 'string',
			defaultsTo: null
		},
		description: {
			type: 'string',
			defaultsTo: null
		},
		feedUpdated: {
			type: 'datetime',
			defaultsTo: null
		},
		categories: {
			type: 'json',
			defaultsTo: null
		},
    visits: {
      type: 'integer',
      defaultsTo: 1
    },
    reviews: {
      collection: 'reviews',
      via: 'feed'
    },
    ratingsTotal: {
      type: 'integer'
    },
    ratingsCount: {
      type: 'integer'
    }

  }
};
