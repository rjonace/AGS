#ifndef VTA_H
#define VTA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct {
	int score;
	bool correct;
} score_struct;

typedef struct { 
	void (* addGradeUseStdin)(int);
	void (* addGradeUseStdout)(int);
	void (* addCodePoints)(const char*, int);
	int (* numInputFiles)(void);
	char* (* getInputFromFile)(void);
	char* (* getInputFromFiles)(int);
	char* (* generateInputFile)(const char*, int);
	char* (* run)(char);
	char* (* runWithInput)(char, char*);
	score_struct* (* compareOutputsByLine)(const char*, const char*, int);
	score_struct* (* compareOutputsByLineRegex)(const char*, const char*, const char*, int);
	score_struct* (* compareOutputsByCase)(int, const char*, const char*, int);
	score_struct* (* compareOutputsByCaseRegex)(int, const char*, const char*, const char*, int);
	void (* addExecResults)(int, const char*, const char*, const char*, score_struct[]);
	void (* addStylePoints)(const char*, int);
} VTA_namespace;
extern VTA_namespace const VTA;

void addGradeUseStdin(int);
void addGradeUseStdout(int);
void addCodePoints(const char*, int);
int numInputFiles(void);
char* getInputFromFile(void);
char* getInputFromFiles(int);
char* generateInputFile(const char*, int);
char* run(char);
char* runWithInput(char, char*);
score_struct* compareOutputsByLine(const char*, const char*, int);
score_struct* compareOutputsByLineRegex(const char*, const char*, const char*, int);
score_struct* compareOutputsByCase(int, const char*, const char*, int);
score_struct* compareOutputsByCaseRegex(int, const char*, const char*, const char*, int);
void addExecResults(int, const char*, const char*, const char*, score_struct[]);
void addStylePoints(const char*, int);

#endif