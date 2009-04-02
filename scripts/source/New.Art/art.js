// art.js

// Graphic adapters

var ART = function(){};

// Canvas adapter

ART.Adapter = new Class({
	
	style: {
		'fill': false,
		'stroke': false,
		'fill-color': 'rgb(0, 0, 0)',
		'stroke-color': 'rgb(0, 0, 0)',
		'stroke-width': 1,
		'stroke-cap': 'round',
		'stroke-join': 'round',
		'shadow-color': null,
		'shadow-blur': 0,
		'shadow-offset-x': 0,
		'shadow-offset-y': 0
	},
	
	initialize: function(){
		this.globalStack = [];
		this.global = {x: 0, y: 0};
		this.shift({x: 0, y: 0});
	},
	
	start: function(vector){
		vector = this.vec(vector);

		this.started = true;
		
		this.boundsMax = {x: null, y: null};
		this.boundsMin = {x: null, y: null};

		this.joinVector = {x: 0, y: 0};
		this.drawn = false;
		
		this.localStack = [];
		this.local = {x: 0, y: 0};

		return this.shift(vector);
	},

	shift: function(vector){
		var p = (this.started) ? 'local' : 'global';
		this[p] = {x: this[p].x + vector.x, y: this[p].y + vector.y};
		return (this.started) ? this.moveTo({x: 0, y: 0}) : this;
	},
	
	save: function(){
		var p = (this.started) ? 'local' : 'global';
		this[p + 'Stack'].push(this[p]);
		return this;
	},
	
	restore: function(){
		var p = (this.started) ? 'local' : 'global';
		var vector = this[p + 'Stack'].pop();
		if (!vector) return this;
		this[p] = vector;
		return (this.started) ? this.moveTo({x: 0, y: 0}) : this;
	},
	
	/* join */
	
	join: function(){
		this.now = this.joinVector;
		this.drawn = false;
		this.joinVector = {x: 0, y: 0};
		return this;
	},
	
	/* to methods */
	
	moveTo: function(vector){
		this.now = this.vec(vector);
		return this.getUpdatedVector(this.now);
	},
	
	lineTo: function(vector){
		this.updateJoinVector();
		this.now = this.vec(vector);
		return this.getUpdatedVector(this.now);
	},

	bezierTo: function(c1, c2, end){
		this.updateJoinVector();
		c1 = this.getUpdatedVector(c1);
		c2 = this.getUpdatedVector(c2);
		this.now = this.vec(end);
		var now = this.getUpdatedVector(this.now);
		return [c1, c2, now];
	},
	
	/* by methods */
	
	moveBy: function(vector){
		return this.moveTo({x: this.now.x + vector.x, y: this.now.y + vector.y});
	},
	
	lineBy: function(vector){
		return this.lineTo({x: this.now.x + vector.x, y: this.now.y + vector.y});
	},
	
	bezierBy: function(c1, c2, end){
		var n = this.now;
		return this.bezierTo({x: c1.x + n.x, y: c1.y + n.y}, {x: c2.x + n.x, y: c2.y + n.y}, {x: end.x + n.x, y: end.y + n.y});
	},
	
	/* to element */
	
	toElement: function(){
		return this.element;
	},
	
	/* privates */
	
	vec: function(vector){
		if (!vector) vector = {};
		return {x: vector.x || 0, y: vector.y || 0};
	},
	
	getUpdatedVector: function(vector){
		var sum = {x: this.global.x + this.local.x + vector.x, y: this.global.y + this.local.y + vector.y};
		
		if (this.boundsMax.x == null || this.boundsMax.x < sum.x) this.boundsMax.x = sum.x;
		if (this.boundsMax.y == null || this.boundsMax.y < sum.y) this.boundsMax.y = sum.y;
		if (this.boundsMin.x == null || this.boundsMin.x > sum.x) this.boundsMin.x = sum.x;
		if (this.boundsMin.y == null || this.boundsMin.y > sum.y) this.boundsMin.y = sum.y;
		
		return {x: sum.x, y: sum.y};
	},
	
	updateJoinVector: function(){
		if (!this.drawn){
			this.drawn = true;
			this.joinVector = this.now;
		}
	},
	
	sanitizeStyle: function(style){
		var styleCC = {}, p;
		for (p in style) styleCC[p.camelCase()] = style[p];
		var thisStyleCC = {};
		for (p in this.style) thisStyleCC[p.camelCase()] = this.style[p];
		return $merge(thisStyleCC, styleCC);
	}
	
});

ART.Adapter.Canvas = new Class({
	
	Extends: ART.Adapter,
	
	initialize: function(id, width, height){
		this.element = new Element('canvas', {'id': id || 'c-' + $time()});
		this.context = this.element.getContext('2d');
		this.resize({x: width, y: height});
		this.parent();
	},
	
	/* canvas implementation */
	
	resize: function(size){
		this.element.width = size.x;
		this.element.height = size.y;
		return this;
	},
	
	start: function(vector){
		this.context.beginPath();
		return this.parent(vector);
	},
	
	join: function(){
		this.context.closePath();
		return this.parent();
	},
	
	moveTo: function(vector){
		var now = this.parent(vector);
		this.context.moveTo(now.x, now.y);
		return this;
	},
	
	lineTo: function(vector){
		var now = this.parent(vector);
		this.context.lineTo(now.x, now.y);
		return this;
	},

	bezierTo: function(c1, c2, end){
		var now = this.parent(c1, c2, end);
		this.context.bezierCurveTo(now[0].x, now[0].y, now[1].x, now[1].y, now[2].x, now[2].y);
		return this;
	},
	
	end: function(style){
		this.started = false;

		style = this.sanitizeStyle(style);
		var ctx = this.context;
		for (var key in style){
			var current = style[key];
			if (current == null) continue;
			switch (key){
				case 'fillColor': ctx.fillStyle = this.getColor(current); break;
				case 'strokeColor': ctx.strokeStyle = this.getColor(current); break;
				case 'strokeWidth': ctx.lineWidth = Number(current); break;
				case 'strokeCap': ctx.lineCap = current; break;
				case 'strokeJoin': ctx.lineJoin = current; break;
				case 'shadowColor': ctx.shadowColor = this.getColor(current); break;
				case 'shadowBlur': ctx.shadowBlur = Number(current); break;
				case 'shadowOffsetX': ctx.shadowOffsetX = Number(current); break;
				case 'shadowOffsetY': ctx.shadowOffsetY = Number(current); break;
			}
		}
		if (style.fill) this.context.fill();
		if (style.stroke) this.context.stroke();
		return this;
	},
	
	clear: function(){
		this.context.clearRect(0, 0, this.element.width, this.element.height);
		return this;
	},
	
	/* privates */
	
	getColor: function(color){
		color = color.valueOf();
		if (typeof color == 'string') return color;
		var gradient = this.context.createLinearGradient(0, this.boundsMin.y, 0, this.boundsMax.y);
		for (var i in color) gradient.addColorStop(i, color[i].valueOf());
		return gradient;
	}
	
});
