#include "VTA.h"

void displayComment(const char*);
void displayScore_I(const char*, int, int);
void displayComparison_I(int[], int, int[], int);

VTA_namespace const VTA = {
	displayComment,
	displayScore_I,
	displayComparison_I
};

void displayComment(const char* comment)
{
	printf("<p>\n\t%s\n</p>", comment);
}

void displayScore_I(const char* title, int pointsEarned, int pointsPossible)
{
	char buffer[strlen(title) + 20];
	sprintf(buffer, "%s: %d/%d", title, pointsEarned, pointsPossible);	
	displayComment(buffer);
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