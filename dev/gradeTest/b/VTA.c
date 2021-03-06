#include "VTA.h"

/** Automatically checks whether stdin was used. Adds/deducts points based on compliance */
void addGradeUseStdin(int points);

/** Automatically checks whether stdout was used. Adds/deducts points based on compliance */
void addGradeUseStdout(int points);

/** Adds an entry to the Code Points of the results object that must be manually graded by the TA */
void addCodePoints(const char* description, int points);

/** Returns the total number of instructor created input files that are available;
 *  Implementation idea: Maybe just put all of the input files in the a directory and run the 
 *  command: "ls -1 | wc" on it */
int numInputFiles(void);

/** Assuming there is one and only one input file, this returns its contents as a string */
char* getInputFromFile(void);

/** Returns the contents of file with inputNumber as a string */
char* getInputFromFiles(int inputNumber);

/** */
char* generateInputFile(const char* pattern, int cases);
char* run(char mode);
char* runWithInput(char mode, char* input);
score_struct* compareOutputsByLine(const char*, const char*, int);
score_struct* compareOutputsByLineRegex(const char*, const char*, const char*, int);
score_struct* compareOutputsByCase(int, const char*, const char*, int);
score_struct* compareOutputsByCaseRegex(int, const char*, const char*, const char*, int);
void addExecResults(int, const char*, const char*, const char*, score_struct[]);
void addCheckHeader(const char*, int);
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
	addCheckHeader,
	addStylePoints
};

void addGradeUseStdin(int points)
{

}

void addGradeUseStdout(int points)
{

}

void addCodePoints(const char* description, int points)
{

}

int numInputFiles(void)
{
	return 0;
}

char* getInputFromFile(void)
{
	return "getInputFromFile";
}

char* getInputFromFiles(int inputNumber)
{
	return "getInputFromFiles";
}

char* generateInputFile(const char* pattern, int cases)
{
	return "generateInputFile";
}

char* run(char mode)
{
	return "run";
}

char* runWithInput(char mode, char* input)
{
	return "runWithInput";
}

score_struct* compareOutputsByLine(const char* correct_output, const char* student_output, int total_points)
{
	return NULL;
}

score_struct* compareOutputsByLineRegex(const char* regex, const char* correct_output, const char* student_output, int total_points)
{
	return NULL;
}

score_struct* compareOutputsByCase(int case_lines, const char* correct_output, const char* student_output, int total_points)
{
	return NULL;
}

score_struct* compareOutputsByCaseRegex(int case_lines, const char* regex, const char* correct_output, const char* student_output, int total_points)
{
	return NULL;
}

void addExecResults(int input_file_num, const char* input, const char* correct_output, const char* student_output, score_struct scores[])
{

}

void addCheckHeader(const char* regex, int points)
{

}
void addStylePoints(const char* description, int points)
{

}