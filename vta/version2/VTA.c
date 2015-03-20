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

/** Returns a string that represents the contents of an input file containing numCases of input cases,
 *  each of which follows the pattern in the first argument 
 *  Implementation idea: probably should make the first line the number of cases, and make the beginning of
 *  each case contain the number of lines for that case */ 
char* generateInputFile(const char* pattern, int numCases);

/** Runs either the instructor's of student's compiled binary and returns its stdout as a string; "mode"
 *  determines which should be run 
 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
 *  struct of information about how the file ran---not just the output */
char* run(char mode);

/** Runs either the instructor's of student's compiled binary with the contents of "input" piped in and 
 *  returns the stdout as a string; "mode" determines which should be run 
 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
 *  struct of information about how the file ran---not just the output */
char* runWithInput(char mode, char* input);

score_struct* compareOutputsByLine(const char* correct_output, const char* student_output, int total_points);
score_struct* compareOutputsByLineRegex(const char* regex, const char* correct_output, const char* student_output, int total_points);
score_struct* compareOutputsByCase(int case_lines, const char* correct_output, const char* student_output, int total_points);
score_struct* compareOutputsByCaseRegex(int case_lines, const char* regex, const char* correct_output, const char* student_output, int total_points);
void addExecResults(int input_file_num, const char* input, const char* correct_output, const char* student_output, score_struct scores[]);

void addCheckHeader(const char* regex, int points);
void addStylePoints(const char* description, int points);

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