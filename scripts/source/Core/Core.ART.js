/* 

Script: Core.js
	MUI - A Web Applications User Interface Framework.

Copyright:
	Copyright (c) 2007-2009 Greg Houston, <http://greghoustondesign.com/>.

License:
	MIT-style license.

Contributors:
	- Scott F. Frederick
	- Joel Lindau

Note:
	This documentation is taken directly from the javascript source files. It is built using Natural Docs.

*/

var MUI = MochaUI = new Hash({
	
	version: '1.0 pre-alpha',

	options: new Hash({
		theme: 'default',				
		advancedEffects: false, // Effects that require fast browsers and are cpu intensive.
		standardEffects: true   // Basic effects that tend to run smoothly.
	}),

	path: {			
		source:  'scripts/source/', // Path to MochaUI source JavaScript
		themes:  'themes/',         // Path to MochaUI Themes
		plugins: 'plugins/'         // Path to Plugins
	},
	
	// Returns the path to the current theme directory
	themePath: function(){
		return MUI.path.themes + MUI.options.theme + '/'; 
	},
	
	files: new Hash()
	
});

MUI.files[MUI.path.source + 'Core/Core.js'] = 'loaded';

MUI.ContainerOptions = {
	data: null,
	request: null,
	
	element: null,
	iframe: null,
	attributes: null,
	container: null,
	content: null,
	
	padding: null
}

MUI.Container = new Class({
	
	Implements: [Events, Options],
	
	options: MUI.ContainerOptions,
	
	initialize: function(element, container, options) {
		this.element = $(element)
		if (!this.element) return
		this.container = $(container) || new Element('div', {'class': 'container'}).inject(this.element)
		this.padding = Hash.map({'top': 0, 'right': 0, 'bottom': 0, 'left': 0}, function(value, key) {
			return this.container.getStyle('padding-' + key) || value
		}, this)
		
		this.set(options)
		return this
	},
	
	set: function() {
		var params = Array.link(arguments, {options: Object.type, content: String.type})
		if (!Hash.getLength(params)) return
		if (params.content) params.options = $merge(params.options, {content: params.content})

		this.setOptions($merge(MUI.ContainerOptions, {padding: this.padding}, params.options))
		this.pad(this.options.padding)
		
		return this.act(this.options)
	},
	
	load: function() {
		this.set.apply(this, arguments)
		return this.options
	},
	
	pad: function(padding) {
		if (!$chk(padding)) return
		
		switch($type(padding)) {
			case "number": case "string":
				return this.container.setStyle('padding', padding)
			case "object": case "hash":
				return Hash.each(padding, function(value, key) {
					this.container.setStyle('padding-' + key, value)
				}.bind(this))
		}
	},
	
	act: function(options) {
		//first set static stuff
		var result = this.append(options.element || options.content) || this.build(options.attributes) || this.render(options.content)
		//second do a request if needed
		return this.request(options.request) || this.browse(options.iframe) || result
	},
	
	browse: function(iframe) {
		if (!iframe) return false;
		switch($type(this.options.iframe)) {
			case "string": 
				this.options.iframe = {src: this.options.iframe};
			case "element":
				this.iframe = this.options.iframe;
			default:
				if (!this.iframe) {
					this.iframe = new IFrame($merge({
						styles: {
							border: 0, 
							display: 'block',
							width: "100%",
							height: this.element.scrollHeight
						}
					}, this.options.iframe))
				} else {
					var options = $merge(this.options.iframe) || {}
					if (options.src == this.iframe.src) delete options.src //do not set same src to avoid refreshing
					this.iframe.set(this.options.iframe)
				}
		}
		
		if (this.iframe.getParent() != this.container) this.iframe.inject(this.container.empty());
		return this.iframe;
	},
	
	append: function(element) {
		if (!$type(element) != "element") return false;
		this.element.adopt(element);
		this.update();
		return element;
	},
	
	request: function(options) {	
		if (!options || !options.url) return false;
		this.xhr = new Request($merge({method: "get"}, options));
		this.xhr.addEvent('success', this.recieve.bind(this));
		return this.xhr.send();
	},
	
	render: function(html) {
		if ($type(html) != 'string' || !html.length) return false;
		if (this.container) return this.container.empty().set('html', html);
	},
	
	build: function(attributes) {
		if ($type(attributes) != 'object') return false;
		return this.append(new Element(attributes.tag || 'div', attributes));
	},
	
	update: function() {
		this.fireEvent('contentLoaded', this.element);
	},
	
	recieve: function(html) {
		this.render(html);
		this.xhr.fireEvent('apply');
	}
	
});

$initialize = function(options) {
	return new this(options);
};

MUI.Container.create = $initialize;

Element.implement({
	setContent: function(content) {
		var controller = this.retrieve('content:controller') || new MUI.Container(this);
		this.store('content:controller', controller);
		return controller.set(content);
	}
});




/* 

function: fixPNG
	Bob Osola's PngFix for IE6.

example:
	(begin code)
	<img src="xyz.png" alt="foo" width="10" height="20" onload="fixPNG(this)">
	(end)

note:
	You must have the image height and width attributes specified in the markup.

*/

function fixPNG(myImage){
	if (Browser.Engine.trident4 && document.body.filters){
		var imgID = (myImage.id) ? "id='" + myImage.id + "' " : "";
		var imgClass = (myImage.className) ? "class='" + myImage.className + "' " : "";
		var imgTitle = (myImage.title) ? "title='" + myImage.title  + "' " : "title='" + myImage.alt + "' ";
		var imgStyle = "display:inline-block;" + myImage.style.cssText;
		var strNewHTML = "<span " + imgID + imgClass + imgTitle
			+ " style=\"" + "width:" + myImage.width
			+ "px; height:" + myImage.height
			+ "px;" + imgStyle + ";"
			+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
			+ "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>";
		myImage.outerHTML = strNewHTML;		
	}
}

Element.implement({
	hide: function(){
		this.setStyle('display', 'none');
		return this;
	},
	show: function(){
		this.setStyle('display', 'block');
		return this;
	}	
});	

/*

Shake effect by Uvumi Tools
http://tools.uvumi.com/element-shake.html

Function: shake

Example:
	Shake a window.
	(start code)
	$('parametrics').shake()
	(end)
  
*/

Element.implement({
	shake: function(radius,duration){
		radius = radius || 3;
		duration = duration || 500;
		duration = (duration/50).toInt() - 1;
		var parent = this.getParent();
		if(parent != $(document.body) && parent.getStyle('position') == 'static'){
			parent.setStyle('position','relative');
		}
		var position = this.getStyle('position');
		if(position == 'static'){
			this.setStyle('position','relative');
			position = 'relative';
		}
		if(Browser.Engine.trident){
			parent.setStyle('height',parent.getStyle('height'));
		}
		var coords = this.getPosition(parent);
		if(position == 'relative' && !Browser.Engine.presto){
			coords.x -= parent.getStyle('paddingLeft').toInt();
			coords.y -= parent.getStyle('paddingTop').toInt();
		}
		var morph = this.retrieve('morph');
		if (morph){
			morph.cancel();
			var oldOptions = morph.options;
		}
		var morph = this.get('morph',{
			duration:50,
			link:'chain'
		});
		for(var i=0 ; i < duration ; i++){
			morph.start({
				top:coords.y+$random(-radius,radius),
				left:coords.x+$random(-radius,radius)
			});
		}
		morph.start({
			top:coords.y,
			left:coords.x
		}).chain(function(){
			if(oldOptions){
				this.set('morph',oldOptions);
			}
		}.bind(this));
		return this;
	}
});

String.implement({
 
	parseQueryString: function() {
		var vars = this.split(/[&;]/);
		var rs = {};
		if (vars.length) vars.each(function(val) {
			var keys = val.split('=');
			if (keys.length && keys.length == 2) rs[decodeURIComponent(keys[0])] = decodeURIComponent(keys[1]);
		});
		return rs;
	}
 
});

// Mootools Patch: Fixes issues in Safari, Chrome, and Internet Explorer caused by processing text as XML. 
Request.HTML.implement({
 
	processHTML: function(text){
		var match = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
		text = (match) ? match[1] : text;
		return new Element('div', {html: text});  
	}
   
});


// This makes it so Request will work to some degree locally
if (location.protocol == "file:"){

	Request.implement({
		isSuccess : function(status){
			return (status == 0 || (status >= 200) && (status < 300));
		}
	});

	Browser.Request = function(){
		return $try(function(){
			return new ActiveXObject('MSXML2.XMLHTTP');
		}, function(){
			return new XMLHttpRequest();
		});
	};
	
}

MUI.Require = new Class({
	Extends: Chain,
	
	Implements: [Options, Events],
	
	options: {
		css: null,
		images: null,
		javascripts: null,
		onload: $empty
	},
	
	initialize: function(options) {
		this.setOptions(options);
		
		var self = this;
		["css", "javascript", "image"].each(function(kind) {
			var files = self.options[kind] || self.options[kind + "s"]
			if (!files || files.length == 0) return;
			
			$A(files).flatten().each(function(file) {
				self.chain(self.load(kind, file));
			});
		}); 
		
		if (this.options.onload) this.chain(function() {
			self.options.onload();
			self.callChain();
		})
		
		return this.callChain();
	},
	
	load: function(kind, file) {
		console.info('loading', file, kind);
		return function() {
			return Asset[kind](file, {
				onload: this.callChain.bind(this)
			});
		}.bind(this);
	}
	
})

Asset.extend({

	/* Fix an Opera bug in Mootools 1.2 */
	javascript: function(source, properties){
		properties = $extend({
			onload: $empty,
			document: document,
			check: $lambda(true)
		}, properties);
		
		if ($(properties.id)) {
			properties.onload();
			return $(properties.id);
		}				
		
		var script = new Element('script', {'src': source + "?" + Math.random(), 'type': 'text/javascript'});
		
		var load = properties.onload.bind(script), check = properties.check, doc = properties.document;
		delete properties.onload; delete properties.check; delete properties.document;
		
		if (!Browser.Engine.webkit419 && !Browser.Engine.presto){
			script.addEvents({
				load: load,
				readystatechange: function(){
					if (Browser.Engine.trident && ['loaded', 'complete'].contains(this.readyState)) 
						load();
				}
			}).setProperties(properties);
		}
		else {
			var checker = (function(){
				if (!$try(check)) return;
				$clear(checker);
				// Opera has difficulty with multiple scripts being injected into the head simultaneously. We need to give it time to catch up.
				Browser.Engine.presto ? load.delay(500) : load();
			}).periodical(50);
		}	
		return script.inject(doc.head);
	},
	
	// Get the CSS with XHR before appending it to document.head so that we can have an onload callback.
	css: function(source, properties){
		
		properties = $extend({
			id: null,
			media: 'screen',
			onload: $empty
		}, properties);		
		
		new Request({
			method: 'get',
			url: source,
			onComplete: function(response) { 
				var newSheet = new Element('link', {
					'id': properties.id,
					'rel': 'stylesheet',
					'media': properties.media,
					'type': 'text/css',
					'href': source
				}).inject(document.head);						
				properties.onload();										
			}.bind(this),
			onFailure: function(response){						
			},					
			onSuccess: function(){						 
			}.bind(this)
		}).send();		
	}	
	
});

/*

REGISTER PLUGINS

	Register Components and Plugins for Lazy Loading

	How this works may take a moment to grasp. Take a look at MUI.Window below.
	If we try to create a new Window and Window.js has not been loaded then the function
	below will run. It will load the CSS required by the MUI.Window Class and then
	then it will load Window.js. Here is the interesting part. When Window.js loads,
	it will overwrite the function below, and new MUI.Window(arg) will be ran
	again. This time it will create a new MUI.Window instance, and any future calls
	to new MUI.Window(arg) will immediately create new windows since the assets
	have already been loaded and our temporary function below has been overwritten.	
	
	Example:
	
	MyPlugins.extend({

		MyGadget: function(arg){
			new MUI.Require({
				css: [MUI.path.plugins + 'myGadget/css/style.css'],
				images: [MUI.path.plugins + 'myGadget/images/background.gif']
				js: [MUI.path.plugins + 'myGadget/scripts/myGadget.js'],
				onload: function(){
					new MyPlguins.MyGadget(arg);
				}		
			});
		}
	
	});	
	
-------------------------------------------------------------------- */

MUI.extend({

	newWindowsFromJSON: function(arg){
		new MUI.Require({
			js: [MUI.path.source + 'Window/Windows-from-json.js'],
			onload: function(){
				new MUI.newWindowsFromJSON(arg);
			}		
		});
	},	
	
	arrangeCascade: function(){
		new MUI.Require({
			js: [MUI.path.source + 'Window/Arrange-cascade.js'],
			onload: function(){
				new MUI.arrangeCascade();
			}		
		});		
	},
	
	arrangeTile: function(){
		new MUI.Require({
			js: [MUI.path.source + 'Window/Arrange-tile.js'],
			onload: function(){
				new MUI.arrangeTile();
			}		
		});		
	},
	
	saveWorkspace: function(){
		new MUI.Require({
			js: [MUI.path.source + 'Layout/Workspaces.js'],
			onload: function(){
				new MUI.saveWorkspace();
			}		
		});		
	},
	
	loadWorkspace: function(){
		new MUI.Require({
			js: [MUI.path.source + 'Layout/Workspaces.js'],
			onload: function(){
				new MUI.loadWorkspace();
			}		
		});			
	},

	Themes: {
		init: function(arg){			
			new MUI.Require({
				js: [MUI.path.source + 'Utilities/Themes.js'],
				onload: function(){
					MUI.Themes.init(arg);
				}		
			});			
		}
	}
	
});
