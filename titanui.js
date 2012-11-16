
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