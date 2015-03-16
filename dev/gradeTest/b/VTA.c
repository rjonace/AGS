#include "VTA.h"

void addGradeUseStdin(int);
void addGradeUseStdout(int);
void addCodePoints(const char*, int);
int numInputFiles(void);
char* getInputFromFile(void);
char* getInputFromFiles(int);
char* generateInputFile(const char*, int);
char* run(char);
char* runWithInput(char, char*);
int[] compareOutputsByLine(const char*, const char*, int);
int[] compareOutputsByLineRegex(const char*, const char*, const char*, int);
int[] compareOutputsByCase(int, const char*, const char*, int);
int[] compareOutputsByCaseRegex(int, const char*, const char*, const char*, int);
void addExecResults(int, const char*, const char*, const char*, int[]);
void addStylePoints(const char*, int);

VTA_namespace const VTA = {
	addGradeUseStdin,
	addGradeUseStdout,
	addCodePoints,
	numInputFiles,
	getInputFromFile,
	getInputFromFiles,
	generateInputFile,
	run,
	runWithInput,
	compareOutputsByLine,
	compareOutputsByLineRegex,
	compareOutputsByCase,
	compareOutputsByCaseRegex,
	addExecResults,
	addStylePoints
};

