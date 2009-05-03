/* ART Window */

ART.WM = {
	
	windows: [],
	
	init: function(){
		
		if (ART.WM.initialized) return;
		ART.WM.initialized = true;
		
		document.addEvent('mousedown', function(e){
			
			var found = false;
			
			ART.WM.windows.each(function(win){
				if (found) return;
				if (ART.WM.checkAgainst(win.element, e)){
					found = true;
					ART.WM.refocus(win);
				}
			});
			
			if (!found) ART.WM.refocus();
			
		});
	},
	
	checkAgainst: function(el, event){
		el = el.getCoordinates();
		var now = {x: event.page.x, y: event.page.y};
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},
	
	include: function(win){
		ART.WM.init();
		ART.WM.refocus(win);
	},
	
	remove: function(win){
		ART.WM.windows.erase(win);
	},
	
	refocus: function(win){
		if (win){
			ART.WM.windows.erase(win).unshift(win);
			win.focus();
		}
		ART.WM.windows.each(function(w, i){
			w.element.setStyle('z-index', ART.WM.windows.length - i + 1);
			if (w != win) w.blur();
		});
	}
	
};


ART.WM.init();