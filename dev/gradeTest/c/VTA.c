#include "VTA.h"

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
	FILE *numInputFiles = popen("ls -1 input4 | wc -l", "r");
	char buf[256];
	while (fgets(buf, sizeof(buf), numInputFiles) != 0);
	pclose(numInputFiles);

	int numfiles;
	sscanf(buf, "%d", &numfiles);
	return numfiles;
}

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

char* generateInputFile(const char* pattern, int cases)
{
	return "generateInputFile";
}

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