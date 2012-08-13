#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <see/see.h>
#include <cgic.h>
#include "golf.h"

void
g_include(
	struct SEE_interpreter *interp, 
	struct SEE_object *self, 
	struct SEE_object *thisobj, 
	int argc, 
	struct SEE_value **argv, 
	struct SEE_value *res)
{
    struct SEE_value s;
    SEE_ToString(interp, argv[0], &s);
    
    char *filename = (char*)malloc(sizeof(char)*(s.u.string->length+1));
    int i;
    for (i = 0; i < s.u.string->length; i++) {
    	filename[i] = s.u.string->data[i];
    }
    
    filename[s.u.string->length] = '\0';
	
		evaluate_file(interp, res, filename);
	
		free(filename);
		SEE_SET_BOOLEAN(res, 1);
}

void
g_println(
	struct SEE_interpreter *interp, 
	struct SEE_object *self, 
	struct SEE_object *thisobj, 
	int argc, 
	struct SEE_value **argv, 
	struct SEE_value *res)
{
        struct SEE_value s;

        SEE_ToString(interp, argv[0], &s);

				int i;
				for (i = 0; i < s.u.string->length; i++) {
					fprintf(cgiOut, "%c", s.u.string->data[i]);
				}
				
				fprintf(cgiOut, "\n");
				
				SEE_SET_BOOLEAN(res, 1);
}

void
g_version(
	struct SEE_interpreter *interp, 
	struct SEE_object *self, 
	struct SEE_object *thisobj, 
	int argc, 
	struct SEE_value **argv, 
	struct SEE_value *res)
{
	SEE_SET_NUMBER(res, GOLF_VERSION);
}

void
evaluate(
	struct SEE_interpreter *interp,
	struct SEE_value *res,
	struct SEE_input *input)
{
		SEE_try_context_t try_ctxt;
		
		/* Establish an exception context */
		SEE_TRY(interp, try_ctxt) {
		       /* Call the program evaluator */
		       SEE_Global_eval(interp, input, res);
		}
		
		/* Finally: */
		SEE_INPUT_CLOSE(input);

		/* Catch any exceptions */
		struct SEE_value v;
		if (SEE_CAUGHT(try_ctxt)) {
			fprintf(cgiOut, "exception:\n");
			SEE_ToString(interp, SEE_CAUGHT(try_ctxt), &v);
			fprintf(cgiOut, "  ");
			SEE_string_fputs(v.u.string, cgiOut);
			fprintf(cgiOut, "\n");
			SEE_PrintContextTraceback(interp, &try_ctxt, cgiOut);
		}
}

void
evaluate_string(
	struct SEE_interpreter *interp, 
	struct SEE_value *res,
	char *string)
{
		struct SEE_input *input;
		struct SEE_string *s = SEE_string_new(interp, 0);
		
		SEE_string_append_ascii(s, string);
		
		/* Turn the string into a SEE_input thing */
		input = SEE_input_string(interp, s);

		evaluate(interp, res, input);
}

void
evaluate_file(
	struct SEE_interpreter *interp, 
	struct SEE_value *res,
	char *filename
	)
{
		struct SEE_input *input;
		
    FILE *f;
		char *file_encoding = "ASCII";
    if ((f = fopen(filename, "r")) == NULL) {
    	fprintf(cgiOut, "couldn't open included file %s\n", filename);
    	exit(EXIT_FAILURE);
    }
	
		/* Turn the file into a token stream */
		input = SEE_input_file(interp, f, filename, file_encoding);
		
		evaluate(interp, res, input);
}