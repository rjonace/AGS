#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>


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

typedef struct {
	int points;
	bool correct;
	char input; 
	char correct_output[257];
	char student_output[257];
} score_struct;

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

struct sectionRow{
	char* description;
	int pointsEarned;
	int pointsPossible;
	char* comments;

	struct sectionRow* nextRow;
};

struct inputCaseData {
	char* correctOutput;
	char* studentOutput;
	bool correct;
	int pointsPossible;
	char* comments;

	struct inputCaseData* nextCase;
};

struct inputFileGradeData {
	char* name;
	char* contents;
	int pointsPossible;
	int pointsEarned;
	struct inputCaseData* cases;
	struct inputFileGradeData* nextInput;
};

struct section {
	char* sectionName;

	int pointsPossible;
	int pointsEarned;

	struct sectionRow* rows;

	struct inputFileGradeData* inputs;

	struct section* nextSection;
};

struct section* sectionList = NULL;

void addSection(const char* name)
{
	struct section* temp = (struct section*)malloc(sizeof(struct section));
	strcpy(temp->sectionName, name);
	temp->rows = NULL;
	temp->inputs = NULL;
	temp->nextSection = NULL;

	if(sectionList == NULL) {
		sectionList = temp;
	}
	else {
		struct section* helper = sectionList;
		while (helper->nextSection != NULL) helper = helper->nextSection;
		helper->nextSection = temp;
	}
}

bool addManuallyGradedRow(char* sectionName, char* description, int pointsPossible){
	if(sectionList == NULL){
		return false;
	}
	else{
		struct section* sectionHelper = sectionList;

		while(strcmp(sectionHelper->sectionName, sectionName) != 0){
			sectionHelper = sectionHelper->nextSection;
			if(sectionHelper == NULL){
				return false;
			}
		}

		struct sectionRow* temp = (struct sectionRow*)malloc(sizeof(struct sectionRow));
		strcpy(temp->description, description);
		temp->pointsEarned = -1;
		temp->pointsPossible = pointsPossible;
		strcpy(temp->comments, "");
		temp->nextRow = NULL;

		if(sectionHelper->rows == NULL){
			sectionHelper->rows = temp;
		}
		else{
			struct sectionRow* rowHelper = sectionHelper->rows;
			while(rowHelper->nextRow != NULL) rowHelper = rowHelper->nextRow;
			rowHelper->nextRow = temp;
		}

		sectionHelper->pointsPossible += temp->pointsPossible;
		return true;
	}
}

bool addAutoGradedInput(char* sectionName, char* inputName, char* inputFileName){
	if(sectionList == NULL){
		return false;
	}
	else{
		struct section* sectionHelper = sectionList;

		while(strcmp(sectionHelper->sectionName, sectionName) != 0){
			sectionHelper = sectionHelper->nextSection;
			if(sectionHelper == NULL){
				return false;
			}
		}

		struct inputFileGradeData* temp = (struct inputFileGradeData*)malloc(sizeof(struct inputFileGradeData));
		strcpy(temp->name, inputName);
		temp->contents = getInputFromFile(inputFileName);
		temp->pointsEarned = 0;
		temp->pointsPossible = 0;
		temp->nextInput = NULL;

		if(sectionHelper->inputs == NULL){
			sectionHelper->inputs = temp;
		}
		else{
			struct inputFileGradeData* inputHelper = sectionHelper->inputs;
			while(inputHelper->nextInput != NULL) inputHelper = inputHelper->nextInput;
			inputHelper->nextInput = temp;
		}

		return true;
	}
}

bool addCaseToGradedInput(char* sectionName, char* inputName, char* correctOutput, char* studentOutput, int points, char* comments){
	if(sectionList == NULL){
		return false;
	}
	else{
		struct section* sectionHelper = sectionList;

		while(strcmp(sectionHelper->sectionName, sectionName) != 0){
			sectionHelper = sectionHelper->nextSection;
			if(sectionHelper == NULL){
				return false;
			}
		}

		if(sectionHelper->inputs == NULL){
			return false;
		}
		else{
			struct inputFileGradeData* inputHelper = sectionHelper->inputs;
			while(strcmp(inputHelper->name, inputName) != 0){
				inputHelper = inputHelper->nextInput;
				if(inputHelper == NULL){
					return false;
				}
			}

			struct inputCaseData* temp = (struct inputCaseData*) malloc(sizeof(struct inputCaseData));
			strcpy(temp->correctOutput, correctOutput);
			strcpy(temp->studentOutput, studentOutput);
			if(strcmp(correctOutput, studentOutput) == 0){
				temp->correct = true;
			}
			else{
				temp->correct = false;
			}

			temp->pointsPossible = points;
			strcpy(temp->comments, comments);
			temp->nextCase = NULL;

			if(inputHelper->cases == NULL){
				inputHelper->cases = temp;
			}
			else{
				struct inputCaseData* caseHelper = inputHelper->cases;
				while(caseHelper->nextCase != NULL) caseHelper = caseHelper->nextCase;
				caseHelper->nextCase = temp;
			}

			inputHelper->pointsPossible += points;
			sectionHelper->pointsPossible += points;
			if (temp->correct){
				inputHelper->pointsEarned += points;
				sectionHelper->pointsPossible += points;
			}

			return true;
		}
	}
}




int main(void) 
{
	/*char* correctoutput = run('i');
	char* studentoutput = run('s');

	printf("%s\n", correctoutput);
	printf("%s\n", studentoutput);

	int numCases;
	score_struct* scores = compareOutputsByLine(correctoutput, studentoutput, 100, &numCases);
	score_struct* scores = compareOutputsByCase(2, correctoutput, studentoutput, 100, &numCases);


	free(correctoutput);
	free(studentoutput);

	int correct_cases = 0, total_points = 0;
	for (int i = 0; i < numCases; i++) {
		printf("%s\n+%d points\n\n", scores[i].correct ? "correct!" : "wrong!", scores[i].points);
		printf("correct answer: \n%s\n", scores[i].correct_output);
		printf("student answer: \n%s\n\n", scores[i].student_output);

		if (scores[i].correct) correct_cases++;
		total_points += scores[i].points;
	}

	free(scores);

	printf("%d out of %d correct cases, %d points total\n\n", correct_cases, numCases, total_points);

	printf("%s\n", runWithInput('s', "basketballgame.in"));*/

	if(!addCaseToGradedInput("a", "b", "c", "d", 5, "e")){
		printf("Input doesn't exist yet.\n");
	}
	if(!addAutoGradedInput("a", "b", "input.txt")){
		printf("Section doesn't exist yet.\n");
	}
	if(!addManuallyGradedRow("a", "b", 5)){
		printf("Section doesn't exist yet.\n");
	}

	addSection("a");
	printf("Section a exists now.\n");

	if(addManuallyGradedRow("a", "row1", 5)){
		printf("Adding MGR to a null list worked.\n");
	}
	if(addManuallyGradedRow("a", "row2", 5)){
		printf("Adding MGR to a non null list worked.\n");
	}
	if(addAutoGradedInput("a", "input1", "input.txt")){
		printf("Adding AGI to a null list worked.\n");
	}
	if(addAutoGradedInput("a", "input2", "input.txt")){
		printf("Adding AGI to a non null list worked.\n");
	}
	if(addCaseToGradedInput("a","input1","1","1112", 5,"no comment")){
		printf("Adding Case to null list worked\n");
	}
	if(addCaseToGradedInput("a","input1", "1","1", 5, "no comment")){
		printf("Adding Case to non null list worked\n");
	}

	printf("Section Name: %s, PointsPossible: %d, PointsEarned: %d\n\nInputs\nCorrect: %d\nCorrect %d\n", sectionList->sectionName, sectionList->pointsPossible, sectionList->pointsEarned, sectionList->inputs->cases->correct, sectionList->inputs->cases->nextCase->correct);

}
