#include "VTA.h"

int readStringLine(const char* src, char* dest, int pos)
{
	int i = 0;
	while(src[pos] != '\n' && src[pos] != '\r') {
		dest[i++] = src[pos++];
	}

	if (src[pos-1] == '\r' && src[pos] == '\n') {
		pos++;
	}
	else if (src[pos-1] == '\n' && src[pos] == '\r') {
		pos++;
	}

	dest[i] = '\0';
	return pos;
}

int readStringCase(int caseLines, const char* src, char* dest, int pos)
{
	int i = 0;
	while(caseLines) {
		if (src[pos] == '\n' || src[pos] == '\r')
			caseLines--;

		dest[i++] = src[pos++];

		if (src[pos] == '\r' && src[pos+1] == '\n') {
			pos++;
		}
		else if (src[pos] == '\n' && src[pos+1] == '\r') {
			pos++;
		}
	}

	dest[i] = '\0';
	return pos;
}

/** Automatically checks whether stdin was used. 
 *
 *  Adds/deducts points to Code Points object based on compliance */
void addGradeUseStdin(int points)
{

}

/** Automatically checks whether stdout was used
 *  
 *  Adds/deducts points to Code Points object based on compliance */
void addGradeUseStdout(int points)
{

}

/** Adds an entry to the Code Points of the results object that must be manually graded by the TA */
void addCodePoints(const char* description, int points)
{

}

/** Returns the total number of instructor created input files that are available */
int numInputFiles(void)
{
	FILE *numInputFiles = popen("ls -1 input4 | wc -l", "r");
	char buf[256];
	while (fgets(buf, sizeof(buf), numInputFiles) != 0);
	pclose(numInputFiles);

	int numfiles;
	sscanf(buf, "%d", &numfiles);
	return numfiles;
}

/** Returns contents of file called fileName as a string */
char* getInputFromFile(const char* fileName)
{
	FILE* inputFile = fopen(fileName, "r");

	fseek(inputFile, 0L, SEEK_END);
	int sz = ftell(inputFile);
	fseek(inputFile, 0L, SEEK_SET);

	char* inputData = calloc(sz + 1, sizeof(char));
	for (int i = 0; i < sz; i++) {
		inputData[i] = (char)fgetc(inputFile);
	} 
	inputData[sz] = '\0';

	fclose(inputFile);
	return inputData;
}

/** Returns a string that represents the contents of an input file containing numCases of input cases,
 *  each of which follows the pattern in the first argument 
 *  Implementation idea: probably should make the first line the number of cases, and make the beginning of
 *  each case contain the number of lines for that case */ 
char* generateInputFile(const char* pattern, int cases)
{
	return "generateInputFile";
}

/** Runs either the instructor's or student's compiled binary and returns its stdout as a string; "mode"
 *  determines which should be run 
 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
 *  struct of information about how the file ran---not just the output */
char* run(char mode)
{
	char command[8];
	if (mode == 'i')
		strcpy(command, "./execi");
	else if (mode == 's')
		strcpy(command, "./execs");
	else {
		return "Error: Invalid run Mode\n";
	}

	FILE *output = popen(command, "r");

	int bufferSize = 1024;
	char* outputData = malloc(bufferSize * sizeof(char));

	int pos = 0;
	while (!feof(output)) {
		outputData[pos++] = (char)fgetc(output);
		if (pos >= bufferSize) {
			bufferSize *= 2;
			outputData = realloc(outputData, bufferSize);
		}
	}
	
	outputData[pos-1] = '\0';
	pclose(output);

	return outputData;
}

/** Runs either the instructor's or student's compiled binary with the contents of "inputFileName" piped in and 
 *  returns the stdout as a string; "mode" determines which should be run 
 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
 *  struct of information about how the file ran---not just the output */
char* runWithInput(char mode, const char* inputFileName)
{

	char command[10 + strlen(inputFileName) + 1];
	if (mode == 'i')
		strcpy(command, "./execi < ");
	else if (mode == 's')
		strcpy(command, "./execs < ");
	else {
		return "Error: Invalid runWithInput Mode\n";
	}

	strcat(command, inputFileName);

	FILE *output = popen(command, "r");

	int bufferSize = 1024;
	char* outputData = malloc(bufferSize * sizeof(char));

	int pos = 0;
	while (!feof(output)) {
		outputData[pos++] = (char)fgetc(output);
		if (pos >= bufferSize) {
			bufferSize *= 2;
			outputData = realloc(outputData, bufferSize);
		}
	}
	
	outputData[pos-1] = '\0';
	pclose(output);

	return outputData;
}

/** Does a diff comparison of the text in correct_output and student_output, treating each line as a case,
 *  and distributes the total_points evenly by number of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByLine(const char* correct_output, const char* student_output, int total_points, int* numCases)
{
	int lineBufferSize = 256;
	int scoresArraySize = 256;

	*numCases = 0;
	score_struct* scores = malloc(scoresArraySize * sizeof(score_struct));

	int corrLength = strlen(correct_output);
	int studLength = strlen(student_output);

	int corrPos = 0, studPos = 0;

	while (corrPos < corrLength && studPos < studLength) {
		char corrLine[lineBufferSize], studLine[lineBufferSize];
		corrPos = readStringLine(correct_output, corrLine, corrPos) + 1;
		studPos = readStringLine(student_output, studLine, studPos) + 1;

		scores[*numCases].correct = !strcmp(corrLine, studLine);
		strncpy(scores[*numCases].correct_output, corrLine, lineBufferSize);
		strncpy(scores[*numCases].student_output, studLine, lineBufferSize);

		*numCases = *numCases + 1;
		if (*numCases >= scoresArraySize) {
			scoresArraySize *= 2;
			scores = realloc(scores, scoresArraySize * sizeof(score_struct));
		}
	}

	while (corrPos < corrLength) {
		char corrLine[lineBufferSize];
		corrPos = readStringLine(correct_output, corrLine, corrPos);
		scores[*numCases].correct = false;
		*numCases = *numCases + 1;

		if (*numCases >= scoresArraySize) {
			scoresArraySize *= 2;
			scores = realloc(scores, scoresArraySize *sizeof(score_struct));
		}
	}

	for (int i = 0; i < *numCases; i++) {
		if (scores[i].correct)
			scores[i].points = total_points / *numCases;
	}

	return scores;
}

/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output, 
 *  treating each line as a case, and distributes the total_points evenly by number of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByLineRegex(const char* regex, const char* correct_output, 
	const char* student_output, int total_points)
{
	return NULL;
}

/** Does a diff comparison of the text in correct_output and student_output, treating cases as groups of 
 *  lines of length case_lines, and distributes the total_points evenly by number of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByCase(int case_lines, const char* correct_output, const char* student_output, 
	int total_points, int* numCases)
{
	int lineBufferSize = 256;
	int scoresArraySize = 256;

	*numCases = 0;
	score_struct* scores = malloc(scoresArraySize * sizeof(score_struct));

	int corrLength = strlen(correct_output);
	int studLength = strlen(student_output);

	int corrPos = 0, studPos = 0;

	while (corrPos < corrLength && studPos < studLength) {
		char corrLine[lineBufferSize], studLine[lineBufferSize];
		corrPos = readStringCase(case_lines, correct_output, corrLine, corrPos);
		studPos = readStringCase(case_lines, student_output, studLine, studPos);

		scores[*numCases].correct = !strcmp(corrLine, studLine);
		strncpy(scores[*numCases].correct_output, corrLine, lineBufferSize);
		strncpy(scores[*numCases].student_output, studLine, lineBufferSize);

		*numCases = *numCases + 1;
		if (*numCases >= scoresArraySize) {
			scoresArraySize *= 2;
			scores = realloc(scores, scoresArraySize * sizeof(score_struct));
		}
	}

	while (corrPos < corrLength) {
		char corrLine[lineBufferSize];
		corrPos = readStringLine(correct_output, corrLine, corrPos);
		scores[*numCases].correct = false;
		*numCases = *numCases + 1;

		if (*numCases >= scoresArraySize) {
			scoresArraySize *= 2;
			scores = realloc(scores, scoresArraySize *sizeof(score_struct));
		}
	}

	for (int i = 0; i < *numCases; i++) {
		if (scores[i].correct)
			scores[i].points = total_points / *numCases;
	}

	return scores;
}

/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output,
 *  treating cases as groups of lines of length case_lines, and distributes the total_points evenly by number
 *  of cases
 *
 *  Returns an array of score_struct */
score_struct* compareOutputsByCaseRegex(int case_lines, const char* regex, const char* correct_output, 
	const char* student_output, int total_points)
{
	return NULL;
}

/** Adds an entry to the Execution Points of the results object with the results of the scores array */
void addExecResults(int input_file_num, const char* description, const char* input, 
	const char* correct_output, const char* student_output, score_struct scores[])
{

}

/** Checks whether header comment of student source code matches regex */
void addCheckHeader(const char* regex, int points)
{

}

/** Adds an entry to the Style Points of the results object that must be manually graded by the TA 
 *
 *  Adds/deducts points to Code Points object based on compliance */
void addStylePoints(const char* description, int points)
{

}

VTA_namespace const VTA = {
	addGradeUseStdin,
	addGradeUseStdout,
	addCodePoints,
	numInputFiles,
	getInputFromFile,
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