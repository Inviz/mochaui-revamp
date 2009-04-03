ART.Widget.Window.Traits.Resizable = new Class({
	options: {
		/*
		onResizeStart
		onResizeFinish
		onSizeChange	
		*/
		limit: { 
			x: [50, 500],
			y: [50, 500]
		}
	},
	
	initialize: function(options) {
		this.parent(options)
		this.addEvent('show', function() {
			this.computeSizes()
			if (this.options.resizable) this.makeResizable()
		}.bind(this))
	},
	
	computeSizes: function(){
		var tbh = this.header.offsetHeight + this.footer.offsetHeight, lim = this.options.limit
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
		}}).inject(this.content);
		
		this.handle = new Element('div', {
			'class': 'handle',
			styles: {
				position: 'absolute'
			}
		}).inject(this.footer);
		
		var self = this;

		this.resizability = new Drag(this.element, $merge({
			limit: {x: [this.minw, this.maxw], y: [this.minh, this.maxh]},
			modifiers: {x: 'width', y: 'height'},
			handle: this.handle
		}, this.options.resizable)).addEvents({
			onBeforeStart: function(){
				//self.showMask();
			},
			onStart: function(){
				console.log('start')
				//if (!self.options.showContentWhileResizing) self.hideCenter();
				//self.hideOverflow();
			},
			onCancel: function(){
				//self.hideMask();
			},
			onDrag: function(){
				//self.remask(false);
				self.setSize(self.resizability.value.now.x, self.resizability.value.now.y)
				self.fireEvent('onSizeChange');
			},
			onComplete: function(){
				//self.showCenter();
				//self.showOverflow();
				//self.remask(true);
				//self.hideMask();
				self.fireEvent('onSizeChange');
			}
		})

	},
})