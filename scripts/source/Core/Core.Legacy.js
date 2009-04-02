MUI.extend({
	
	Windows: {
		instances: new Hash()
	},
	
	updateContent: function(options){
		var element = options.element
		delete options.element
		return element.setContent(options)
	}
	
})