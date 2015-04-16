#ifndef VTA_H
#define VTA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct {
	int points;
	bool correct;
	char correct_output[257];
	char student_output[257];
} score_struct;

typedef struct { 
	void (* addGradeUseStdin)(int);
	void (* addGradeUseStdout)(int);
	void (* addCodePoints)(const char*, int);
	int (* numInputFiles)(void);
	char* (* getInputFromFile)(const char*);
	char* (* generateInputFile)(const char*, int);
	char* (* run)(char);
	char* (* runWithInput)(char, const char*);
	score_struct* (* compareOutputsByLine)(const char*, const char*, int, int*);
	score_struct* (* compareOutputsByLineRegex)(const char*, const char*, const char*, int);
	score_struct* (* compareOutputsByCase)(int, const char*, const char*, int, int*);
	score_struct* (* compareOutputsByCaseRegex)(int, const char*, const char*, const char*, int);
	void (* addExecResults)(int, const char*, const char*, const char*, const char*, score_struct[]);
	void (* addCheckHeader)(const char*, int);
	void (* addStylePoints)(const char*, int);
} VTA_namespace;

extern VTA_namespace const VTA;

#endif