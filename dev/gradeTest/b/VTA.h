#ifndef VTA_H
#define VTA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct { 
	void (* displayComment)(const char*);
	void (* displayScore)(const char*, int, int);
	void (* displayScores)(const char**, int[], int[], int);
	void (* displayTable)(int[], int);
	void (* displayComparison_I)(int[], int, int[], int);
	void (* displayComparison_D)(double[], int, double[], int);
	void (* displayComparison_S)(const char**, int, const char**, int);
} VTA_namespace;

extern VTA_namespace const VTA;

#endif