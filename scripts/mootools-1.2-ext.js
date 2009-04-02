Class.Mutators.Inherits = function(self, klasses){
	$splat(klasses).each(function(klass){
		Class.prototyping = klass.prototype;
		var subclass = new klass;
		delete subclass.parent;
		self = Class.inherit(self.prototype || self, subclass)
		delete Class.prototyping;
	});
	return self;
};

Behavioured = {
	behaviourise: function(element) {
		var result = new Hash
		this.Behaviour.each(function(selector, dependency) {
			var name = dependency.replace(/^.+?-/, '')
			if (element.hasClass(name) || (selector && (element.match(selector) || element.getElement(selector)))) result.set(dependency, name)
		}, this)
		return result
	},
	
	Behaviour: new Hash,
	Traits: new Hash
};

Traits = $merge({
	create: function(element, a,b,c,d) {
		var traits = this.behaviourise(element)
		var chain = new Chain
		using(traits.getKeys(), function() {
			var klass = new Class({
				Extends: this,
				Inherits: traits.getValues().map(function(name) { 
					name = name.camelCase().capitalize();
					return this.Traits[name] || this.Base.Traits[name]
				}.bind(this))
			})
			var instance = new klass(element, a,b,c,d)
			console.log('Created', instance, 'of', klass, 'for', element, 'traits are', traits.getKeys())
			chain.callChain(instance)
		}.create({bind: this, delay: 10}))
		
		return chain
	}
}, Behavioured)

Types = $merge({
	create: function(element, a,b,c,d) {
		var candidates = this.behaviourise(element)
		var candidate = candidates.getKeys()[0]
		if (candidate) {
			using(candidate, function() {
				var name = candidates.get(candidate)
				var klass = this[name.camelCase().capitalize()]
				console.log('Chose', klass, ', type is', name)
				klass.Base = this //make subclass aware of parent
				klass.create(element, a,b,c,d)
			}.bind(this))
		} else {
			new this(element, a,b,c,d)
		}
	}
}, Behavioured)
