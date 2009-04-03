ART.Widget.Window.Traits.Controllable = new Class({
	options: {
		/*
		onDragStart
		onDragFinish
		*/
	},
	
	initialize: function(options) {
		this.parent(options)
		if (this.close) $(this.close).addEvent('click', this.hide.bind(this))
		if (this.minimize) $(this.minimize).addEvent('click', this.collapse.bind(this))
		if (this.maximize) $(this.maximize).addEvent('click', this.expand.bind(this))
	}
})