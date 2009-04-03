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

MUI.Windows.windowOptionsOriginal = $merge(MUI.Windows.windowOptions);

MUI.Window = new Class({
	Extends: ART.Widget.Window.Traited,
	
	options: $merge(MUI.ContainerOptions, {
		id:                null,
		
		icon:              false,
		require:           {},
		closeAfter:        false,
		
		x: 								 0,
		y:                 0,	
		
		container:         null,
		restrict:          true,
		
		onShow: function() {
			ART.WM.include(this)
			this.blur()
		},
		
		onFocus: function() {
			console.log('focus')
		},
		
		onBlur: function() {
			console.log('blur')
		},
		header: null,
		footer: null
	}),
	
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
		this.set(options);
	},
	
	set: function(options) {
		/*Fuck, i have something to do with naming. footer & header are taken already*/
		
		if (!this.foot)	this.foot = new MUI.Container(this.footer);
		if (!this.head) this.head = new MUI.Container(this.header);
		if (!this.cont) this.cont = new MUI.Container(this.content);
		
		this.setOptions($merge(options, {
			footer: this.foot.load(options.footer),
			header: this.head.load(options.header, options.title)
		}, this.cont.load(options)))
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
			left: this.options.x,
			top: this.options.y,
			zIndex: 250
		})
	}//,
	//
	//maximize: function() {
	//	this.fireEvent('maximize');
	//},
	//
	//minimize: function() {
	//	this.fireEvent('minimize');
	//}
	//
})