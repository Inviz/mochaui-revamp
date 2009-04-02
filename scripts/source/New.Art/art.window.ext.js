ART.Theme = {}
ART.Theme.Aqua = {
	style: {
		base: {
			
			'height': 300,
			'width': 400,
			
			'button-margin': 20,
			'button-top': 5,
			
			'corner-radius': 3,
			'header-height': 24,
			'footer-height': 16,
			'header-background-color': {0: hsb(0, 0, 90), 1: hsb(0, 0, 60)},
			'footer-background-color': {0: hsb(0, 0, 80), 1: hsb(0, 0, 70)},
			'header-reflection-color': {0: hsb(0, 0, 100, 1), 1: hsb(0, 0, 0, 0)},
			'footer-reflection-color': {0: hsb(0, 0, 100, 1), 1: hsb(0, 0, 0, 0)},
			'border-color': hsb(300, 0, 50, 0.8)
		},
		
		focused: {
			'button-margin': 20,
			'button-top': 5,

			'corner-radius': 3,
			'header-height': 24,
			'footer-height': 16,
			'border-color': hsb(300, 0, 10, 0.8)
		}
	}
}

ART.Window.extend(Traits)
ART.Window.Traits.Draggable = new Class({
	options: {
		draggable: true
	},
	
	initialize: function(options) {
		this.parent(options)
		if (this.options.draggable) this.makeDraggable()
	},

	makeDraggable: function(){
		if (this.madeDraggable) return;
		this.madeDraggable = true;

		new Drag.Move(this.element, {handle: [this.header, this.footer]});
	}
})

ART.Window.Traits.Resizable = new Class({
	options: {
		resizable: true
	},
	
	initialize: function(options) {
		this.parent(options)
		this.addEvent('inject', function() {
			this.computeSizes()
			if (this.options.resizable) this.makeResizable()
		}.bind(this))
	},
	
	computeSizes: function(){
		var tbh = this.header.offsetHeight + this.footer.offsetHeight, lim = this.options.limit;
		this.minh = lim.y[0] + tbh;
		this.maxh = lim.y[1] + tbh;
		this.minw = lim.x[0];
		this.maxw = lim.x[1];
	},
	
	hideOverflow: function(){
		if (Browser.Engine.gecko && Browser.Platform.mac) this.center.setStyle('overflow', 'hidden');
	},

	showOverflow: function(){
		if (this.focused) this.center.setStyle('overflow', this.options.styles.overflow);
	},

	remask: function(drawShadow){
		this.draw({
			height: this.mask.clientHeight - this.top.offsetHeight - this.bottom.offsetHeight,
			width: this.mask.clientWidth, drawShadow: (Browser.Engine.webkit420) ? true : drawShadow
		});
	},
		
	makeResizable: function(){

		if (this.madeResizable) return;
		this.madeResizable = true;
		
		this.mask = new Element('div', {styles: {
			position: 'absolute',
			display: 'none'
		}}).inject(this.container);
		
		var self = this;

		new Drag(this.element, {
			limit: {x: [this.minw, this.maxw], y: [this.minh, this.maxh]},
			modifiers: {x: 'width', y: 'height'},
			onBeforeStart: function(){
				self.showMask();
			},
			onStart: function(){
				if (!self.options.showContentWhileResizing) self.hideCenter();
				self.hideOverflow();
			},
			onCancel: function(){
				self.hideMask();
			},
			onDrag: function(){
				self.remask(false);
				self.fireEvent('onSizeChange');
			},
			onComplete: function(){
				self.showCenter();
				self.showOverflow();
				self.remask(true);
				self.hideMask();
				self.fireEvent('onSizeChange');
			},
			handle: this.handle
		});

	},
})

ART.Window.Extended = new Class($merge(ART.Theme.Aqua, {
	Extends: ART.Window,

	Inherits: ART.Window.Traits.Draggable,

	options: {
		header: null,
		footer: null,
		request: {},
		content: null
	},

	initialize: function(options) {
		this.parent(options)
		if (this.options.header) this.header.setContent(this.options.header)
		this.setContent(this.options)
		if (this.options.footer) this.footer.setContent(this.options.footer)
	},

	setContent: function(){
		this.content.setContent.apply(this.content, arguments);
		return this;
	}
}))