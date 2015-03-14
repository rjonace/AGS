#include "VTA.h"

void displayComment(const char*);
void displayScore(const char*, int, int);
void displayScores(const char**, int[], int[], int);
void displayTable(int[], int);
void displayComparison_I(int[], int, int[], int);
void displayComparison_D(double[], int, double[], int);
void displayComparison_S(const char**, int, const char**, int);

VTA_namespace const VTA = {
	displayComment,
	displayScore,
	displayScores,
	displayTable,
	displayComparison_I,
	displayComparison_D,
	displayComparison_S
};

void displayComment(const char* comment)
{
	printf("<p>\n\t%s\n</p>", comment);
}

void displayScore(const char* title, int pointsEarned, int pointsPossible)
{
	char buffer[strlen(title) + 20];
	sprintf(buffer, "%s: %d/%d", title, pointsEarned, pointsPossible);	
	displayComment(buffer);
}

void displayScores(const char** title, int pointsEarned[], int pointsPossible[], 
		int length)
{
	for (int i = 0; i < length; i++) {
		char buffer[strlen(title[i]) + 20];
		sprintf(buffer, "%s: %d/%d\n", title[i], pointsEarned[i], pointsPossible[i]);	
		displayComment(buffer);
		if (i < length - 1)
			printf("\t");
	}
}

void displayTable(int array[], int aLength)
{
	printf("<table>\n\t<th>\n\t\t");
	for (int i = 0; i < aLength; i++) {
		printf("<td>%d</td>", i + 1);
	}
	printf("\n\t</th>\n\n");

	printf("\t<tr>\n\t\t");
	for (int i = 0; i < aLength; i++) {
		printf("<td>%d</td>", array[i]);
	}
	printf("\n\t</tr>\n\n");
	printf("</table>");
}

void displayComparison_I(int professorAnswers[], int pLength, int studentAnswers[], 
	int sLength)
{
	bool lengthsEqual = (pLength == sLength);

	printf("<table>\n");
	printf("\t<th>\n");
	printf("\t\t<td>Test Case #</td> <td>Professor Output</td> <td>Student Output</td>");
	printf("\t</th>\n\n");

	for(int i = 0; i < pLength; i++) {
		printf(
			(lengthsEqual)
			?((professorAnswers[i] != studentAnswers[i])
				?("\t<tr style=\"background-color:red; color:white;\">\n")
				:("\t<tr>\n"))
			:((i >= sLength)
				?("\t<tr style=\"background-color:red; color:white;\">\n")
				:((professorAnswers[i] != studentAnswers[i])
					?("\t<tr style=\"background-color:red; color:white;\">\n")
					:("\t<tr>\n")))
		);

		printf("\t\t<td>%d</td> <td>%d</td> ", (i+1), professorAnswers[i]);

		if (i < sLength)
			printf("<td>%d</td>\n", studentAnswers[i]);
		else
			printf("<td>N/array</td>\n");

		
		printf("\t</tr>\n\n");
	}

	printf("</table>");
}

void displayComparison_D(double professorAnswers[], int pLength, double studentAnswers[], 
	int sLength)
{
	bool lengthsEqual = (pLength == sLength);

	printf("<table>\n");
	printf("\t<th>\n");
	printf("\t\t<td>Test Case #</td> <td>Professor Output</td> <td>Student Output</td>");
	printf("\t</th>\n\n");

	for(int i = 0; i < pLength; i++) {
		printf(
			(lengthsEqual)
			?((professorAnswers[i] != studentAnswers[i])
				?("\t<tr style=\"background-color:red; color:white;\">\n")
				:("\t<tr>\n"))
			:((i >= sLength)
				?("\t<tr style=\"background-color:red; color:white;\">\n")
				:((professorAnswers[i] != studentAnswers[i])
					?("\t<tr style=\"background-color:red; color:white;\">\n")
					:("\t<tr>\n")))
		);

		printf("\t\t<td>%d</td> <td>%lf</td> ", (i+1), professorAnswers[i]);

		if (i < sLength)
			printf("<td>%lf</td>\n", studentAnswers[i]);
		else
			printf("<td>N/array</td>\n");

		
		printf("\t</tr>\n\n");
	}

	printf("</table>");
}

void displayComparison_S(const char* professorAnswers[], int pLength, const char* studentAnswers[], 
	int sLength)
{
	bool lengthsEqual = (pLength == sLength);

	printf("<table>\n");
	printf("\t<th>\n");
	printf("\t\t<td>Test Case #</td> <td>Professor Output</td> <td>Student Output</td>");
	printf("\t</th>\n\n");

	for(int i = 0; i < pLength; i++) {
		printf(
			(lengthsEqual)
			?((professorAnswers[i] != studentAnswers[i])
				?("\t<tr style=\"background-color:red; color:white;\">\n")
				:("\t<tr>\n"))
			:((i >= sLength)
				?("\t<tr style=\"background-color:red; color:white;\">\n")
				:((professorAnswers[i] != studentAnswers[i])
					?("\t<tr style=\"background-color:red; color:white;\">\n")
					:("\t<tr>\n")))
		);

		printf("\t\t<td>%d</td> <td>%s</td> ", (i+1), professorAnswers[i]);

		if (i < sLength)
			printf("<td>%s</td>\n", studentAnswers[i]);
		else
			printf("<td>N/array</td>\n");

		
		printf("\t</tr>\n\n");
	}

	printf("</table>");
}