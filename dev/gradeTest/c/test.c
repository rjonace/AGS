#include <stdlib.h>
#include <stdio.h>
#include <string.h>


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


int main(void) 
{
	const char* fileName = "basketballgame.in";
//	char* input = getInputFromFile(fileName);
//	printf("%s", input);

	char* output = run('s');

	printf("%s", output);
}