ART.Themes = {}
ART.Themes.Mocha = {
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

ART.Widget.Window.extend(Traits)
ART.Widget.Window.Traited = new Class({
	Extends: ART.Widget.Window,

	//Inherits: ART.Widget.Window.Traits.Draggable,

	options: {
		header: null,
		content: null,
		footer: null,
		theme: 'Mocha'
	},

	initialize: function(options) {
		this.parent(options)
		if (this.options.header) this.header.setContent(this.options.header)
		if (this.options.content) this.content.setContent(this.options.content)
		if (this.options.footer) this.footer.setContent(this.options.footer)
	},

	setContent: function(){
		this.content.setContent.apply(this.content, arguments);
		return this;
	}
})