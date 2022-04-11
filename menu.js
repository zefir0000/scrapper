var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }

{
  let window = _____WB$wombat$assign$function_____("window");
  let document = _____WB$wombat$assign$function_____("document");
	var Class = (function() {

		var IS_DONTENUM_BUGGY = (function(){
			for (var p in { toString: 1 }) {
				if (p === 'toString') return false;
			}
			return true;
		})();

		function subclass() {};
		function create() {
			var parent = null, properties = $A(arguments);
			if (Object.isFunction(properties[0]))
				parent = properties.shift();

			function klass() {
				this.initialize.apply(this, arguments);
			}

			Object.extend(klass, Class.Methods);
			klass.superclass = parent;
			klass.subclasses = [];

			if (parent) {
				subclass.prototype = parent.prototype;
				klass.prototype = new subclass;
				parent.subclasses.push(klass);
			}

			for (var i = 0, length = properties.length; i < length; i++)
				klass.addMethods(properties[i]);

			if (!klass.prototype.initialize)
				klass.prototype.initialize = Prototype.emptyFunction;

			klass.prototype.constructor = klass;
			return klass;
		}

		function addMethods(source) {
			var ancestor   = this.superclass && this.superclass.prototype,
					properties = Object.keys(source);

			if (IS_DONTENUM_BUGGY) {
				if (source.toString != Object.prototype.toString)
					properties.push("toString");
				if (source.valueOf != Object.prototype.valueOf)
					properties.push("valueOf");
			}

			for (var i = 0, length = properties.length; i < length; i++) {
				var property = properties[i], value = source[property];
				if (ancestor && Object.isFunction(value) &&
						value.argumentNames()[0] == "$super") {
					var method = value;
					value = (function(m) {
						return function() { return ancestor[m].apply(this, arguments); };
					})(property).wrap(method);

					value.valueOf = (function(method) {
						return function() { return method.valueOf.call(method); };
					})(method);

					value.toString = (function(method) {
						return function() { return method.toString.call(method); };
					})(method);
				}
				this.prototype[property] = value;
			}

			return this;
		}

		return {
			create: create,
			Methods: {
				addMethods: addMethods
			}
		};
	})();
var Menu = Class.create();
Menu.prototype = {

	initialize: function(idOrElement, name, customConfigFunction) {

		this.name = name;
		this.type = "menu";
		this.closeDelayTimer = null;
		this.closingMenuItem = null;

		this.config();
		if (typeof customConfigFunction == "function") {
			this.customConfig = customConfigFunction;
			this.customConfig();
		}
		this.rootContainer = new MenuContainer(idOrElement, this);
	},

	config: function() {
	  this.collapseBorders = true;
	  this.quickCollapse = true;
	  this.closeDelayTime = 500;
	}

}

var MenuContainer = Class.create();
MenuContainer.prototype = {
	initialize: function(idOrElement, parent) {
		this.type = "menuContainer";
  		this.menuItems = [];
		this.init(idOrElement, parent);
	},

	init: function(idOrElement, parent) {
	  this.element = this.asd(idOrElement);
	  this.parent = parent;
	  this.parentMenu = (this.type == "menuContainer") ? ((parent) ? parent.parent : null) : parent;
	  this.root = parent instanceof Menu ? parent : parent.root;
	  this.id = this.element.id;

	  if (this.type == "menuContainer") {
	  	if (this.element.hasClassName("level1")) this.menuType = "horizontal";
		else if (this.element.hasClassName("level2")) this.menuType = "dropdown";
		else this.menuType = "flyout";

	    if (this.menuType == "flyout" || this.menuType == "dropdown") {
	      this.isOpen = false;
		  Element.setStyle(this.element,{
	      	position: "absolute",
	      	top: "0px",
	      	left: "0px",
	      	visibility: "hidden"});
	    } else {
	      this.isOpen = true;
	    }
	  } else {
	    this.isOpen = this.parentMenu.isOpen;
	  }

	  var childNodes = this.element.childNodes;
	  if (childNodes == null) return;

	  for (var i = 0; i < childNodes.length; i++) {
	    var node = childNodes[i];
	    if (node.nodeType == 1) {
	      if (this.type == "menuContainer") {
	        if (node.tagName.toLowerCase() == "li") {
	          this.menuItems.push(new MenuItem(node, this));
	        }
	      } else {
	        if (node.tagName.toLowerCase() == "ul") {
	          this.subMenu = new MenuContainer(node, this);
	        }
	      }
	    }
	  }
	},
	asd: function(element) {
		if (arguments.length > 1) {
      for (var i = 0, elements = [], length = arguments.length; i < length; i++)
        elements.push(this.asd(arguments[i]));
      return elements;
    }

    if (Object.isString(element))
      element = document.getElementById(element);
    return Element.extend(element);
	},
	getBorders: function(element) {
	  var ltrb = ["Left","Top","Right","Bottom"];
	  var result = {};
	  for (var i = 0; i < ltrb.length; ++i) {
	    if (this.element.currentStyle)
	      var value = parseInt(this.element.currentStyle["border"+ltrb[i]+"Width"]);
	    else if (window.getComputedStyle)
	      var value = parseInt(window.getComputedStyle(this.element, "").getPropertyValue("border-"+ltrb[i].toLowerCase()+"-width"));
	    else
	      var value = parseInt(this.element.style["border"+ltrb[i]]);
	    result[ltrb[i].toLowerCase()] = isNaN(value) ? 0 : value;
	  }
	  return result;
	},

	open: function() {
	  if (this.root.closeDelayTimer) window.clearTimeout(this.root.closeDelayTimer);
	  this.parentMenu.closeAll(this);
	  this.isOpen = true;
	  if (this.menuType == "dropdown") {
		Element.setStyle(this.element,{
			left: (Position.positionedOffset(this.parent.element)[0]) + "px",
			top: (Position.positionedOffset(this.parent.element)[1] + Element.getHeight(this.parent.element)) + "px"
		});

	  } else if (this.menuType == "flyout") {
	    var parentMenuBorders = this.parentMenu ? this.parentMenu.getBorders() : new Object();
	    var thisBorders = this.getBorders();
	    if (
	      (Position.positionedOffset(this.parentMenu.element)[0] + this.parentMenu.element.offsetWidth + this.element.offsetWidth + 20) >
	      (window.innerWidth ? window.innerWidth : document.body.offsetWidth)
	    ) {
			Element.setStyle(this.element,{
	      		left: (- this.element.offsetWidth - (this.root.collapseBorders ?  0 : parentMenuBorders["left"])) + "px"
			});
	    } else {
			Element.setStyle(this.element,{
	    		left: (this.parentMenu.element.offsetWidth - parentMenuBorders["left"] - (this.root.collapseBorders ?  Math.min(parentMenuBorders["right"], thisBorders["left"]) : 0)) + "px"
			});
	    }
		Element.setStyle(this.element,{
	    	top: (this.parent.element.offsetTop - parentMenuBorders["top"] - this.menuItems[0].element.offsetTop) + "px"
		});
	  }
	  Element.setStyle(this.element,{visibility: "visible"});
	},

	close: function() {
		Element.setStyle(this.element,{visibility: "hidden"});
		this.isOpen = false;
		this.closeAll();
	},

	closeAll: function(trigger) {
		for (var i = 0; i < this.menuItems.length; ++i) {
			this.menuItems[i].closeItem(trigger);
		}
	}

}


var MenuItem = Class.create();

Object.extend(Object.extend(MenuItem.prototype, MenuContainer.prototype), {
	initialize: function(idOrElement, parent) {
		var menuItem = this;
		this.type = "menuItem";
		this.subMenu;
		this.init(idOrElement, parent);
		if (this.subMenu) {
			this.element.onmouseover = function() {
				menuItem.subMenu.open();
			}
		} else {
		if (this.root.quickCollapse) {
		  this.element.onmouseover = function() {
			menuItem.parentMenu.closeAll();
		  }
		}
		  }
		  var linkTag = this.element.getElementsByTagName("A")[0];
		  if (linkTag) {
		 linkTag.onfocus = this.element.onmouseover;
		 this.link = linkTag;
		 this.text = linkTag.text;
		  }
		  if (this.subMenu) {
		this.element.onmouseout = function() {
		  if (menuItem.root.openDelayTimer) window.clearTimeout(menuItem.root.openDelayTimer);
		  if (menuItem.root.closeDelayTimer) window.clearTimeout(menuItem.root.closeDelayTimer);
		  eval(menuItem.root.name + ".closingMenuItem = menuItem");
		  menuItem.root.closeDelayTimer = window.setTimeout(menuItem.root.name + ".closingMenuItem.subMenu.close()", menuItem.root.closeDelayTime);
		}
		  }
	},

	openItem: function() {
	  this.isOpen = true;
	  if (this.subMenu) { this.subMenu.open(); }
	},

	closeItem: function(trigger) {
	  this.isOpen = false;
	  if (this.subMenu) {
	    if (this.subMenu != trigger) this.subMenu.close();
	  }
	}
});


var menu;


function configMenu() {
  this.closeDelayTime = 300;
}

function initMenu() {
  menu = new Menu('root', 'menu', configMenu);
}


Event.observe(window, 'load', initMenu, false);

}
