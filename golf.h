#define GOLF_VERSION 0.1
#define GOLF_ROOT /Users/alan/working/golf

struct SEE_interpreter g_interp_storage, *g_interp;
struct SEE_input *g_input;
SEE_try_context_t g_try_ctxt;
struct SEE_value g_result;

/* golf_native.c */
void
g_include(
	struct SEE_interpreter *interp, 
	struct SEE_object *self, 
	struct SEE_object *thisobj, 
	int argc, 
	struct SEE_value **argv, 
	struct SEE_value *res);
	
void
g_println(
	struct SEE_interpreter *interp, 
	struct SEE_object *self, 
	struct SEE_object *thisobj, 
	int argc, 
	struct SEE_value **argv, 
	struct SEE_value *res);

void
g_version(
	struct SEE_interpreter *interp, 
	struct SEE_object *self, 
	struct SEE_object *thisobj, 
	int argc, 
	struct SEE_value **argv, 
	struct SEE_value *res);
void

evaluate_string(
	struct SEE_interpreter *interp, 
	struct SEE_value *res,
	char *string);
	
void
evaluate_file(
	struct SEE_interpreter *interp, 
	struct SEE_value *res,
	char *filename);
	
/* golf.c */
int
cgiMain();

void
print_file(char *filename);

