#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <time.h>


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

const char* generateInputFile(const char* pattern, int numCases)
{
	return "NULL";
}



char* generateTempBlankInputFile(void)
{
	char *inputFileName = malloc(20 * sizeof(char));

	bool haveGoodFileName = false;
	srand(time(NULL));
	do {
		unsigned fileNumber = rand();
		sprintf(inputFileName, "%010d.in", fileNumber);
		char command[20];
		strcpy(command, "ls ");
		strcat(command, inputFileName);
		FILE* commandCheck = popen(command, "r");
		char commandOutput[100];
		fscanf(commandCheck, "%s", commandOutput);
		haveGoodFileName = (bool)strcmp(commandOutput, inputFileName);
		if (haveGoodFileName) fclose(commandCheck);
	} while(!haveGoodFileName);


	FILE* tempFile = fopen(inputFileName, "w");
	fclose(tempFile);
	return inputFileName;
}

char* runWithGeneratedInput(char mode, const char* pattern, int numCases)
{
	const char* inputFileText = generateInputFile(pattern, numCases);	
	char* inputFileName = generateTempBlankInputFile();
	FILE* inputFile = fopen(inputFileName, "w");
	if (inputFile) {
		fprintf(inputFile, "%s", inputFileText);
		fclose(inputFile);
	}

	char* result = runWithInput(mode, inputFileName);
	free(inputFileName);
	return result;
}


int main(void)
{
	runWithGeneratedInput('s', "abc", 10);
}
