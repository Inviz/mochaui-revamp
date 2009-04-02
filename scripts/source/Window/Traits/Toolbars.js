MUI.Window.Traits = new Class({
	
	options: {
		// Toolbar
		toolbars: {}
	},
	
	initialize: function(options) {
		return this.parent(options)
		
		this.toolbars = Hash.map(this.options.toolbars, function(value, name) {
			return this.setToolbar(toolbar, name)
		}.bind(this))
	}
})