#include "VTA.h"

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

score_struct* compareOutputsByLineRegex(const char* regex, const char* correct_output, 
	const char* student_output, int total_points)
{
	return NULL;
}

score_struct* compareOutputsByCase(int case_lines, const char* correct_output, const char* student_output, 
	int total_points)
{
	return NULL;
}

score_struct* compareOutputsByCaseRegex(int case_lines, const char* regex, const char* correct_output, 
	const char* student_output, int total_points)
{
	return NULL;
}

void addExecResults(int input_file_num, const char* description, const char* input, 
	const char* correct_output, const char* student_output, score_struct scores[])
{

}

void addCheckHeader(const char* regex, int points)
{

}
void addStylePoints(const char* description, int points)
{

}