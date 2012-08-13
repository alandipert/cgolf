#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <see/see.h>
#include <cgic.h>
#include "golf.h"

int serverside = 0;

int
cgiMain()
{ 
	cgiHeaderContentType("text/html");
	
	int serverside = 0;
	cgiFormInteger("serverside", &serverside, 0);
	
	char function_call[50];
	int callback = 0;
	if (cgiFormString("function_call", &function_call[0], 50) == cgiFormSuccess)
		callback = 1;
	
	if(serverside) {
		/* Initialise the SEE library */
		SEE_init();
		
		/* Initialise an interpreter */
		SEE_interpreter_init(&g_interp_storage);
		g_interp = &g_interp_storage;
	
		/* Bring our native functions into the interpreter */
		SEE_CFUNCTION_PUTA(g_interp, g_interp->Global, "println", g_println, 1, 0);
		SEE_CFUNCTION_PUTA(g_interp, g_interp->Global, "include", g_include, 1, 0);
		SEE_CFUNCTION_PUTA(g_interp, g_interp->Global, "version", g_version, 1, 0);
		
		/* evaluate bootstrapping code, and then script, then transform events */
		evaluate_file(g_interp, &g_result, "/Users/alan/working/golf/boot/serverside.js");
		evaluate_file(g_interp, &g_result, cgiPathTranslated);
		
		/* this is dangerous lol.  should check to make sure the callback is a function */
		if(callback)
			evaluate_string(g_interp, &g_result, function_call);
		
		/* this converts elements with onclick event attributes into links */
		evaluate_file(g_interp, &g_result, "/Users/alan/working/golf/boot/transform.js");
		evaluate_string(g_interp, &g_result, "document.render();");
		
	} else {
		
		fprintf(cgiOut, "<html>\n<head>\n");
		fprintf(cgiOut, "<script type = \"text/javascript\">\n");
		fprintf(cgiOut, "function boot() {\n");
		print_file("/Users/alan/working/golf/boot/clientside.js");
		print_file(cgiPathTranslated);
		fprintf(cgiOut, "\n}\n");
		fprintf(cgiOut, "</script>\n</head>\n");
		fprintf(cgiOut, "<body onload = \"boot();\">\n");
		fprintf(cgiOut, "</body>\n</html>");
		
	}
	
	return EXIT_SUCCESS;
}

void
print_file(char *filename)
{
	FILE *f;
	if ((f = fopen(filename, "r")) == NULL) {
		fprintf(cgiOut, "couldn't open file %s for printing\n", filename);
		exit(EXIT_FAILURE);
	}
	
	int c;
	while ((c = fgetc(f)) != EOF) {
		fprintf(cgiOut, "%c", c);
	}
}
	