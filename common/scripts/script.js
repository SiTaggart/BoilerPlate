/* Author: Simon Taggart */
if (!window.st) window.st = {};
var st = window.st;

Modernizr.load({
	test: window.JSON,
	nope:'/common/scripts/plugins/json2.js'
});

Modernizr.load({
	load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js',
	callback: function() {
		if (!window.jQuery) {
            Modernizr.load('/common/scripts/libs/jquery.js');
		}
	},
	complete: function() {
		st.siteInit();
	}
});

//load utilities
Modernizr.load({
	load:[
		'ielt9!/common/scripts/plugins/selectivizr-min.js',
		'/common/scripts/utilities.js'
	]
});

st.siteInit = function(){

	Modernizr.load({
		test: $('.widget-twitter').length !== 0,
		yep:'/common/scripts/widgets/widget.twitterList.js',
		callback: function() {
			st.twitterList.init();
		}
	});

	Modernizr.load({
		test: $('.widget-flickr').length !== 0,
		yep:{
			'p': '/common/scripts/plugins/jquery.jFlickrFeed.js',
			'w': '/common/scripts/widgets/widget.flickrList.js'
		},
	    callback: {
	    	'w': function (url, result, key) {
				st.flickrList.init();
		    }
	    }
	});

}
















