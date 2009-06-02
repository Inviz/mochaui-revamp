/* ART Window */

MUI.WM = {
	
	windows: [],
	
	init: function(){
		
		if (MUI.WM.initialized) return;
		MUI.WM.initialized = true;
		
		document.addEvent('mousedown', function(e){
			
			var found = false;
			
			MUI.WM.windows.each(function(win){
				if (found) return;
				if (MUI.WM.checkAgainst(win.element, e)){
					found = true;
					MUI.WM.refocus(win);
				}
			});
			
			if (!found) MUI.WM.refocus();
			
		});
	},
	
	checkAgainst: function(el, event){
		el = el.getCoordinates();
		var now = {x: event.page.x, y: event.page.y};
		return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
	},
	
	include: function(win){
		MUI.WM.init();
		MUI.WM.refocus(win);
	},
	
	remove: function(win){
		MUI.WM.windows.erase(win);
	},
	
	refocus: function(win){
		if (win){
			MUI.WM.windows.erase(win).unshift(win);
			win.focus();
		}
		MUI.WM.windows.each(function(w, i){
			w.element.setStyle('z-index', MUI.WM.windows.length - i + 1);
			if (w != win) w.blur();
		});
	}
	
};


MUI.WM.init();