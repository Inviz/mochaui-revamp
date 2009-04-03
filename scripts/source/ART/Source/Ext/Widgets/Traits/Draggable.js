ART.Widget.Window.Traits.Draggable = new Class({
	options: {
		/*
		onDragStart
		onDragFinish
		*/
	},
	
	initialize: function(options) {
		this.parent(options)
		if (this.options.draggable) this.makeDraggable()
	},

	makeDraggable: function(){
		if (this.madeDraggable) return;
		this.madeDraggable = true;
		
		new Drag.Move(this.element, {
			handle: [this.header],
			onStart: Event.propagate(this, 'dragStart'),
			onFinish: Event.propagate(this, 'dragFinish')
		});
	}
})

