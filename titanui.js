
/**
 *  TitanUI is a CommonJS module for Titanium Mobile that adds UI helpers to simplify some frequently used UI elements and effects
 */


/**
 * Creates a scrollable card view (a scroll view with preview of the next and previous views)
 * 
 * @param options {Object} Configuration object
 * @param options.width {Number} width The total width that the viewable card, padding, and previews will occupy.
 * @param options.cardWidth {Number} cardWidth The width of each card (must be uniform)
 * @param options.cardHeight {Number} The height of each card (must be uniform)
 * @param options.padding {Number} The space between cards
 * @param [options.views=[]] {Array} (optional) The cards
 * 
 * @returns Ti.UI.ScrollableView
 */
exports.ScrollableCardView = function(/* Object */ options){
	
	options = options || {};
	
	return Ti.UI.createScrollableView({ 
	  views: options.views || [],
	  showPagingControl: false,
	  width: options.cardWidth+options.padding, //Width of the card, plus 1/2 padding on each side of the card
	  height: options.cardHeight,
	  clipViews: false, //This is what displays the preview of the next/previous cards
	  hitRect: {  
	    height: options.cardHeight,
	    width: options.width,
	    x: -(options.width-(options.cardWidth+options.padding))/2, //Shift the hit rect to the edge of the desired width, to include the card previews
	    y: 0     
	  }
	});
};

/**
 * Returns a popup/bounce animation effect
 * 
 * @param {Object} viewToAnimate
 */
exports.BounceAnimation = function (viewToAnimate){
	
	// create first transform to go beyond normal size
	var t1 = Titanium.UI.create2DMatrix().scale(1.1);
	
	// create the second transform to go below normal size
	var t2 = Titanium.UI.create2DMatrix().scale(.9);
	
	// create the third transform to bring it home
	var t3 = Ti.UI.create2DMatrix().scale(1.0);
	
	var a1 = Titanium.UI.createAnimation({
		transform: t1,
		duration: 200
	});
	
	var a2 = Ti.UI.createAnimation({
		transform: t2,
		duration: 150
	});
	
	var a3 = Ti.UI.createAnimation({
		transform: t3,
		duration: 150
	});

	// when this animation completes, scale to normal size
	a1.addEventListener('complete', function(){		
		viewToAnimate.animate(a2);
	});
	
	a2.addEventListener('complete', function(){
		viewToAnimate.animate(a3);
	});
	
	return a1;
}

/**
 * Creates a facebook like box and registers a callback for when the like occurs
 * 
 * @param settings {Object} Configuration object
 * @param settings.appId {String} Facebook App Id
 * @param settings.siteUrl {String} Url for your application's website (required so Facebook doesn't see this as spam)
 * @param settings.likeUrl {String} Url to the facebook page that will be liked
 * @param settings.send {Boolean} Whether or not the send button should be displayed
 * @param settings.colorScheme {String} Like box color scheme. Dark or Light only.
 * @param settings.showFaces {Boolean} Whether or not faces should be shown
 * @param settings.stream {Boolean} Whether or not to show page stream
 * @param settings.header {Boolean} Whether or not to show the header
 * @param settings.success {Function} The callback for a successful "Like"
 */
exports.FacebookLikeBox = function(settings){
	
	settings = settings || {};
	var allowedColorSchemes = ['dark', 'light'];
	var allowedFonts = []
	
	//Defaults
	settings.send = typeof(settings.send) == "boolean" ? settings.send : false;
	settings.colorScheme = allowedColorSchemes.indexOf(settings.colorScheme) > -1 ? settings.colorScheme : 'light';
	settings.showFaces = typeof(settings.showFaces) == "boolean" ? settings.showFaces : false;
	settings.stream = typeof(settings.stream) == "boolean" ? settings.stream : false;
	settings.header = typeof(settings.header) == "boolean" ? settings.header : false;
	settings.success = settings.success && typeof(settings.success) == "function" ? settings.success : funcion(){ Ti.API.info("Page Liked"); };
	
	var wView = Ti.UI.createWebView({
		backgroundColor: 'transparent',
		width: 325,
		opacity: 1.0
	});
	
	//Fill the window with the like box xfbml code and the callback upon like being clicked
	var html = [];

	html.push('<html>',
		'<body style="background-color: \'transparent\';">',
		'<div id="fb-root"></div>',
		"<script>",
			'window.fbAsyncInit = function() {',
		    	'FB.init({appId:'+settings.appId+', xfbml:true});', 
		    	'FB.Event.subscribe("edge.create", function(e){ window.location = "event:like"; });',
		  	'};',
		  '(function(d, debug){',
		     'var js, id = "facebook-jssdk", ref = d.getElementsByTagName("script")[0];',
		     'if (d.getElementById(id)) {return;}',
		     'js = d.createElement("script"); js.id = id; js.async = true;',
		     'js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";',
		     'ref.parentNode.insertBefore(js, ref);',
		   '}(document, false));',
		'</script>',	
		'<fb:like-box href="'+settings.likeUrl+'" ',
			'send="'+settings.send+'" ',
			'colorscheme="'+colorscheme+'" ',
			'width="325" show_faces="'+settings.showFaces+'" ',
			'stream="'+settings.stream+'" ',
			'header="'+settings.header+'">',
		'</fb:like-box>',
	'</html>');

	wView.setHtml(html.join(''), { baseURL:settings.siteUrl });
	
	wView.addEventListener('beforeload', function(e){	
		if(e.url == 'event:like'){
			settings.success.call();
		}
	});
	
	return wView;
}