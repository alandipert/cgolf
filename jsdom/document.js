/*
	@name: Document
	@descr:	represents a DOM "DocuElementment"
	@api: golf 1.0
*/
var Document = function () {
	this.doc_root = new Element("html");
	this.doc_head = new Element("head");
	this.doc_title = new Element("title");
	this.doc_body = new Element("body");

	this.doc_root.appendChild(this.doc_head);
	this.doc_head.appendChild(this.doc_title);
	this.doc_root.appendChild(this.doc_body);

	this.createElement = function(tag) {
		var ret = new Element(tag);
		ret.ownerDocument = this;
		return ret;	
	};
	
	this.createTextNode = function(text) {
		/* the textNode is a simple object concocted here */
		var textNode = function() {
			this.text = text;
			this.childNodes = new Array();
			this.render = function() {
				return this.text;
			};
		};
		
		return new textNode;
	};
	
	this.body = this.doc_body;
	this.head = this.doc_head;
	this.styleSheets = new Array();
	
	this.title = "";
	this.write = function(str) {
		println(str);
	};
	
	this.render = function () {
		this.doc_title.innerHTML = this.title;
		println(this.doc_root.render());
	};

	/*
		@name: getElementById
		@descr: returns the element whose ID is specified. 
		@param id: string representing the unique id of the element being sought. 
		@returns DOMNode or null if not found
		@api: dom 3.0
	*/
	this.getElementById = function(id) {
		for (i in this.doc_root.childNodes) {
			if(this.doc_root.childNodes[i].id == id) {
				return this.doc_root.childNodes[i];
			} else {
				if(this.doc_root.childNodes[i].golf_getElementById != null) {
					var obj = this.doc_root.childNodes[i].golf_getElementById(id);
					if(obj != null) {
						return obj;
					}
				}
			}
		}
		
		return null;
	};
	
	/*
		@name: getElementsByTagName
		@descr: returns a list of elements of a given name in the document.
		@param id: tagName is a string representing the name of the elements.
		@returns nodeList of DOMNodes or empty array if none found
		@api: dom 3.0
	*/
	this.getElementsByTagName = function(tagName) {
		var return_array = new Array();
		for (i in this.doc_root.childNodes) {
			if(this.doc_root.childNodes[i].tagName == tagName) {
				return_array.push(this.doc_root.childNodes[i]);
			}
			
			this.doc_root.childNodes[i].golf_getElementsByTagName(tagName, return_array);
		}
		
		return return_array;
	};
}