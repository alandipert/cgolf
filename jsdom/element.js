/*
	@name: Element
	@descr:	represents a node in the DOM
	@param tag: the name of the new element
	@api: golf 1.0
*/
var Element = function(tag) {
	this.tagName = tag;				//tagName returns the name of the element. 
	this.attributes = {};			//Returns an array of attributes on the given element
	this.childNodes = Array();//Returns an array of child nodes on the given element node
	this.id;
	this.length = 0;
	
	this.className = null;
	this.dir = "ltr";
	this.firstChild = null;
	//this.lang = "en"; //see RFC 1766 for others
	this.lastChild = null;
	
	/* XML/XUL attributes, not implemented */
	this.localName = null;
	this.namespaceURI = null;
	
	this.nodeName = this.tagName;
	this.nodeType = 1; //pg 36 domref.pdf for others, ELEMENT_NODE = 1; 
	this.nodeValue = null; //pg 37 domref.pdf
	this.parentNode = null;
	this.previousSibling = null;
	this.nextSibling = null;
	
	/* non-spec gecko attributes */
	this.offsetHeight = 0;
	this.offsetLeft = 0;
	this.offsetParent = 0;
	this.offsetTop = 0;
	this.offsetWidth = 0;
	
	this.ownerDocument = null; //set in document.js by createElement
	this.prefix = null; //namespace prefix; unimplemented
	this.style = null; //unimplemented, see doc/domstyleruleslist.txt
	
	/*
		@name: hasAttribute
		@descr: returns whether or not the element has this attribute
		@param name: the name of the attribute as a string 
		@param value: whether or not it exists
		@api: dom 3.0
	*/
	this.hasAttribute = function(attName) {
		for(a in this.attributes) {
			if(a == attName)
				return true;
		}
		
		return false;
	};
	
	/*
		@name: setAttribute
		@descr: adds a new attribute or changes the value of an existing attribute on the 
		current element
		@param name: the name of the new attribute as a string 
		@param value: the desired value of the new attribute
		@api: dom 3.0
	*/
	this.setAttribute = function(key,val) {
		this.attributes[key] = val;
	};

	/*
		@name: removeChild
		@descr: removes a child from this element
		@param name: the element to remove 
		@api: dom 3.0
	*/
	this.removeChild = function(child) {
		var childIndex = null;
		for (var i = 0; i < this.childNodes.length; i++) {
			if (this.childNodes[i] == child) {
				childIndex = i;
			}
		}
		
		if(childIndex != null) {
			this.childNodes.splice(childIndex, 1);
		}
	};
		
	/*
		@name: appendChild
		@descr: adds a child to this DOMElement
		@param name: the DOMElement to append 
		@api: dom 3.0
	*/
	this.appendChild = function(child) {
		
		if (this.childNodes.length > 0) {
			this.childNodes[this.childNodes.length-1].nextSibling = child;
			child.previousSibling = this.childNodes[this.childNodes.length-1];
			this.lastChild = child;
		} else {
			this.firstChild = child;
		}
		
		child.parentNode = this;
		this.childNodes.push(child);
		this.length++;
		
		if (this.firstChild == null)
			this.firstChild = this.childNodes[0];
		
		if (this.lastChild == null)
			this.lastChild = this.childNodes[this.childNodes.length-1];
			
		//this.childNodes.push(child);
	};

	/*
		@name: golf_getElementById
		@descr: checks children for a matching id
		@param name: the name of the id to search for
		@api: golf 1.0
	*/
	this.golf_getElementById = function(id) {
		for (i in this.childNodes) {
			if(this.childNodes[i].id == id) {
				return this.childNodes[i];
			} else {
				if(this.childNodes[i].golf_getElementById != null) {
					var obj = this.childNodes[i].golf_getElementById(id);
					if(obj != null) {
						return obj;
					}
				}
			}
		}
		
		return null;
	};

	/*
		@name: golf_getElementsByTagName
		@descr: returns a list of elements of a given name in the document.
		@param id: tagName is a string representing the name of the elements.
		@returns nodeList of DOMNodes or empty array if none found
		@api: golf 1.0
	*/
	this.golf_getElementsByTagName = function(tagName, return_array) {
		for (i in this.childNodes) {
			if(this.childNodes[i].tagName == tagName) {
				return_array.push(this.childNodes[i]);
			}
			
			this.childNodes[i].golf_getElementsByTagName(tagName, return_array);
		}
		
		return return_array;
	};
	
	/*
		@name: render
		@descr: prints children recursively to stdout using golf's native println(), 
		@api: golf 1.0
	*/
	this.render = function() {
		//generate opening tag with attributes for this node
		var ret = '<' + this.tagName;
		
		for(var a in this.attributes) {
			ret += ' ' + a + ' = "' + this.attributes[a] + '" ';  
		}
		
		//print class, if set
		if (this.className) {
			ret += " class = \""+this.className+'"';
		}
		
		//print id, if set
		if (this.id) {
			ret += " id = \""+this.id+'"';
		}
		
		//print lang, if set
		if (this.lang) {
			ret += " lang = \""+this.lang+'"';
		}
		
		ret += '>\n';

		if(this.innerHTML) {
			ret += this.innerHTML+'\n';
		}

		//render children
		for(var i = 0; i < this.childNodes.length; i++) {
			ret += this.childNodes[i].render();
		}

		//generate closing tag for this node
		ret += '</' + this.tagName + '>\n';
		return ret;
	};
}