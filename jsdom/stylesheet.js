/*
	@name: Stylesheet
	@descr:	represents a stylesheet in the document
	@api: dom 3.0
*/
var Stylesheet = function() {
	this.cssRules;
	this.disabled;
	this.href;
	this.media;
	this.ownerNode;
	this.ownerRule;
	this.parentStyleSheet;
	this.title;
	this.type;
	
	this.deleteRule = function() {};
	this.insertRule = function() {};
}