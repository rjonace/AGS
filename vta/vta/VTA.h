#ifndef VTA_H
#define VTA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct { 
	void (* displayComment)(const char*);
	void (* displayScore_I)(const char*, int, int);
	void (* displayComparison_I)(int[], int, int[], int);
} VTA_namespace;

extern VTA_namespace const VTA;



#endif