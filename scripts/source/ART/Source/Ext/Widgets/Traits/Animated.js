ART.Widget.Window.Traits.Animated = new Class({
	options: {
		style: {
			'collapsed-background-color': "#b0b0b0"
		}
		/*
		onDragStart
		onDragFinish
		*/
	},
	
	initialize: function(options) {
		this.parent(options);
		this.element.fade('hide');
	},
	
	show: function() {
		this.parent();
		this.element.fade('in');
	},
	
	hide: function() {
		this.parent();
		this.element.fade('out');
	},	
	
	collapse: function() {
		if (!this.collapsed) {
			this.collapsed = true;
			if (!this.heights) this.heights = [this.footer.offsetHeight, this.element.offsetHeight - this.header.offsetHeight];
			if (!this.previousResize) this.previousResize = this.options.resize;
			this.options.resize = false;
			this.tween(0, this.header.offsetHeight + 2);
			if (this.content) {
				if (!this.content.retrieve('background-color')) this.content.store('background-color', this.content.getStyle('background-color'));
				this.content.tween('background-color', this.options.style['collapsed-background-color'])
			}
		}
	},
	
	expand: function() {
		if (this.collapsed) {
			this.collapsed = false;
			this.options.resize = this.previousResize;
			this.tween.apply(this, this.heights);
			if (this.content) {
				this.content.tween('background-color', this.content.retrieve('background-color'))
			}
		}
	},
	
	toggle: function() {
		return (this.collapsed) ? (this.expand()) : (this.collapse());
	},
	
	tween: function(footer, content) {
		if (!this.drawer) this.drawer = new Fx.Draw(this, {duration: 300});
		if (footer == 0) {
			this.drawer.start({
				'footer-height': footer,
				'height': content
			})
			this.content.getFirst().fade('out');
			this.footer.setStyle('display', 'none')
		} else {
			this.drawer.start({
				'footer-height': footer,
				'height': content
			}).chain(function() {
				
				this.content.getFirst().fade('in');
				this.footer.setStyle('display', 'block')
			}.bind(this))
		}
	}
})


/* Fx Draw */

Fx.Draw = new Class({
	
	Extends: Fx,
	
	initialize: function(widget, options){
		this.widget = widget;
		this.parent(options);
	},
	
	set: function(style){
		this.widget.render(style)
		return this;
	},
	
	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},
	
	start: function(properties){
		if (!this.check(properties)) return this;
		var from = {}, to = {};
		for (var p in properties){
			from[p] = this.widget.style.now[p];
			to[p] = properties[p];
		}
		return this.parent(from, to);
	}
	
});
