#ifndef VTA_H
#define VTA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct { 
	const char* (* const displayScore)(int, char *);
	const char* (* const display)(void);
} namespace_struct;

extern namespace_struct const VTA;



#endif