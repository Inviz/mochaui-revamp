MUI.files[MUI.path.source + 'Window/Window.js'] = 'loading';
//$require(MUI.themePath() + '/css/Dock.css');


MUI.extend({
	Windows: {	  
		instances:      new Hash(),
		indexLevel:     100,          // Used for window z-Index
		windowIDCount:  0,            // Used for windows without an ID defined by the user
		windowsVisible: true,         // Ctrl-Alt-Q to toggle window visibility
		focusingWindow: false		
	}	
});	

MUI.Windows.contentOptions = {
	'content': null,
	'request': {
		'url': ''
	}
};

MUI.Windows.panelOptions = $merge(MUI.Windows.contentOptions, {
	'position': 'top',
	'height': 29
});

MUI.Windows.windowOptionsOriginal = $merge(MUI.Windows.windowOptions);

MUI.Window = new Class({
	Extends: ART.Window.Extended,
	
	options: {
		id:                null,
		
		icon:              false,
		require:           {},
		closeAfter:        false,
		
		container:         null,
		restrict:          true,
		
		onShow: function() {
			console.log('show')
			ART.WM.include(this)
			this.blur()
		},
		
		onFocus: function() {
			console.log('focus')
		},
		
		onBlur: function() {
			console.log('blur')
		}
	},
	
	initialize: function(options) {
		this.parent(options);
		this.hide()
		if (Hash.getLength(this.options.require)) {
			new MUI.Require($merge(this.options.require, {
				onload: this.show.bind(this)
			}));
		} else {
			this.show();
		}
	},
	
	show: function() {
		this.parent()
		
		// Shorten object chain
		var options = this.options;
		
		var instances = MUI.Windows.instances;
		var instanceID = MUI.Windows.instances.get(this.options.id);
	
		// Here we check to see if there is already a class instance for this window
		if (instanceID) var instance = instanceID;
		
		this.fireEvent('beforeBuild');
		
		$(this).inject(this.options.container || document.body).setStyles({
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 250
		})
	},
	
	maximize: function() {
		this.fireEvent('maximize');
	},
	
	minimize: function() {
		this.fireEvent('minimize');
	}
	
})