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
	char* (* getInputFromFile)(const char*);
	char* (* generateInputFile)(const char*, int);
	char* (* run)(char);
	char* (* runWithInput)(char, const char*);
	score_struct* (* compareOutputsByLine)(const char*, const char*, int);
	score_struct* (* compareOutputsByLineRegex)(const char*, const char*, const char*, int);
	score_struct* (* compareOutputsByCase)(int, const char*, const char*, int);
	score_struct* (* compareOutputsByCaseRegex)(int, const char*, const char*, const char*, int);
	void (* addExecResults)(int, const char*, const char*, const char*, const char*, score_struct[]);
	void (* addCheckHeader)(const char*, int);
	void (* addStylePoints)(const char*, int);
} VTA_namespace;

extern VTA_namespace const VTA;

/** Automatically checks whether stdin was used. 
 *
 *  Adds/deducts points to Code Points object based on compliance */
void addGradeUseStdin(int points);

/** Automatically checks whether stdout was used
 *  
 *  Adds/deducts points to Code Points object based on compliance */
void addGradeUseStdout(int points);

/** Adds an entry to the Code Points of the results object that must be manually graded by the TA */
void addCodePoints(const char* description, int points);

/** Returns the total number of instructor created input files that are available;
 *  Implementation idea: Maybe just put all of the input files in the a directory and run the 
 *  command: "ls -1 | wc" on it */
int numInputFiles(void);

/** Returns contents of file called fileName as a string */
char* getInputFromFile(const char* fileName);

/** Returns a string that represents the contents of an input file containing numCases of input cases,
 *  each of which follows the pattern in the first argument 
 *  Implementation idea: probably should make the first line the number of cases, and make the beginning of
 *  each case contain the number of lines for that case */ 
char* generateInputFile(const char* pattern, int numCases);

/** Runs either the instructor's or student's compiled binary and returns its stdout as a string; "mode"
 *  determines which should be run 
 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
 *  struct of information about how the file ran---not just the output */
char* run(char mode);

/** Runs either the instructor's or student's compiled binary with the contents of "input" piped in and 
 *  returns the stdout as a string; "mode" determines which should be run 
 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
 *  struct of information about how the file ran---not just the output */
char* runWithInput(char mode, const char* inputFileName);

/** Does a diff comparison of the text in correct_output and student_output, treating each line as a case,
 *  and distributes the total_points evenly by number of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByLine(const char* correct_output, const char* student_output, int total_points);

/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output, 
 *  treating each line as a case, and distributes the total_points evenly by number of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByLineRegex(const char* regex, const char* correct_output, 
	const char* student_output, int total_points);

/** Does a diff comparison of the text in correct_output and student_output, treating cases as groups of 
 *  lines of length case_lines, and distributes the total_points evenly by number of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByCase(int case_lines, const char* correct_output, const char* student_output, 
	int total_points);

/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output,
 *  treating cases as groups of lines of length case_lines, and distributes the total_points evenly by number
 *  of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByCaseRegex(int case_lines, const char* regex, const char* correct_output, 
	const char* student_output, int total_points);

/** Adds an entry to the Execution Points of the results object with the results of the scores array */
void addExecResults(int input_file_num, const char* description, const char* input, 
	const char* correct_output, const char* student_output, score_struct scores[]);

/** Checks whether header comment of student source code matches regex */
void addCheckHeader(const char* regex, int points);

/** Adds an entry to the Style Points of the results object that must be manually graded by the TA 
 *
 *  Adds/deducts points to Code Points object based on compliance */
void addStylePoints(const char* description, int points);

#endif