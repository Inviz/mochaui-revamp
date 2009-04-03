ART.Widget.Window.Traits.Themeable = new Class({
	initialize: function(options) {
		if (options.theme) options = $merge(ART.Themes[options.theme], options)
		this.parent(options)
	}
})