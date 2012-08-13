var convertOnClicks = function(element) {
	for (var i = 0; i < element.childNodes.length; i++) {
		if(element.childNodes[i].attributes){
			for (var a in element.childNodes[i].attributes) {
				if(a.toLowerCase() == "onclick") {
					element.childNodes[i].tagName = "a";
					element.childNodes[i].setAttribute("href", "testpage.golf?serverside=1&function_call="+
						element.childNodes[i].attributes[a]);
						
					var new_attr = {};
					for(var q in element.childNodes[i].attributes) {
						if(q.toLowerCase() != "onclick") {
							new_attr[q] = element.childNodes[i].attributes[q];
						}
					}
					
					element.childNodes[i].attributes = new_attr;
				}
			}
		}
		convertOnClicks(element.childNodes[i]);
	}
}

convertOnClicks(document.body);
