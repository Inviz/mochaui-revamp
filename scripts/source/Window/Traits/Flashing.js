MUI.Window.Traits.Flashing = new Class({
	options: {
		flash: null
	},
	
	initialize: function(options) {
		this.parent(options)
		
		if (this.options.flash) {
			switch($type(this.options.flash)) {
				case "string": case "number":
					this.options.flash = {duration: this.options.flash}
			}
			this.hide(this.options.flash)
		}
	
})