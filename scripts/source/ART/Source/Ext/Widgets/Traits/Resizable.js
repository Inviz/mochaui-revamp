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
		},
		overflow: false
	},
	
	initialize: function(options) {
		options.resize = true;
		this.parent(options);
		this.addEvent('show', function() {
			if (this.options.resizable) this.makeResizable()
		}.bind(this));
	},
	
	setLimit: function(){
		var tbh = this.header.offsetHeight + this.footer.offsetHeight, lim = this.options.limit
		this.minh = lim.y[0] + tbh;
		this.maxh = lim.y[1] + tbh;
		this.minw = lim.x[0];
		this.maxw = lim.x[1];
		
		this.resizability.options.limit = lim;
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
	
	persist: function() {
		var container = this.content.getFirst()
		var width = container.scrollWidth
		if (this.content.offsetWidth < width && this.options.limit.x[0] < this.content.scrollWidth) {
			this.resizability.limit.x[0] = width + 10
		}
		var height = container.scrollHeight + this.footer.offsetHeight + this.header.offsetHeight
		if (this.content.offsetHeight < container.scrollHeight && this.options.limit.y[0] < this.content.scrollHeight) {
			this.resizability.limit.y[0] = height + 10
		}
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
				self.persist()
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
		
		this.setLimit()

	},
})