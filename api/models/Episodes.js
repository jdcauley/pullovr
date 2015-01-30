/**
* Episodes.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    feed: {
      model: 'feeds'
    },
		title: {
			type: 'string',
			defaultsTo: null
		},
		urlTitle: {
			type: 'string',
			defaultsTo: null
		},
		extFree: {
			type: 'string',
			defaultsTo: null
		},
		fileType: {
			type: 'string',
			defaultsTo: 'audio/mpeg'
		},
		description: {
			type: 'string',
			defaultsTo: null
		},
		summary: {
			type: 'string',
			defaultsTo: null
		},
		pubDate: {
			type: 'datetime',
			defaultsTo: null
		},
		episodePage: {
			type: 'string',
			defaultsTo: null
		},
		publisher: {
			type: 'string',
			defaultsTo: null
		},
		image: {
			type: 'string',
			defaultsTo: null
		},
		primaryEnclosureUrl: {
			type: 'string',
			defaultsTo: null
		},
		allEnclosures: {
			type: 'json',
			defaultsTo: null
		},
		content: {
			type: 'string',
			defaultsTo: null
		}

  }
};
