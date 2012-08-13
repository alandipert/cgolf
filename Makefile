LIBDIR=/usr/local/lib
INCDIR=/usr/local/include
BINDIR=/Users/alan/Sites/cgi-bin

CFLAGS=#-g -pg -Wall
CC=gcc
LIBS=-L$(LIBDIR) -lgc -lsee -lcgic
INCLUDE=-I$(INCDIR)
SRC=src
TARGET  = golf
OBJS    = golf_native.o\
					golf.o
          
all:	gnu golf 

gnu:
	LD_RUN_PATH=$(LIBDIR)
	export LD_RUN_PATH
	
golf: $(OBJS)
	$(CC) $(INCLUDE) $(LIBS) $(CFLAGS) -o $(TARGET) $(OBJS)
	cp golf $(BINDIR)

clean:
	rm -f *.o gmon.* $(TARGET)
