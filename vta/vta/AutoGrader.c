#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "VTA.h"
#include "SkeletonForStudents.h"

double c2FSolution(double temp)
{
	return (1.8 * temp) + 32;
}

double f2CSolution(double temp)
{
	return (temp - 32) / 1.8;
}

int tempConvertSolution(char mode, double temp)
{
	return toupper(mode) == 'F' ? (int)f2CSolution(temp): (int)c2FSolution(temp);
}


int main( int argc, const char* argv[] )
{
	int counter = 0;
	
	char modes[] = {'f', 'c', 'f', 'f', 'c', 'f', 'f', 'c', 'f', 'c'};
	int temps[] = {212, 100, 100, 98, 0, 32, 0, -40, -40, 40};
	
	int studentAnswer[10];
	int solution[10];
	
	for(int i = 0; i < 10; i++){
		studentAnswer[i] = (int)tempConvert(modes[i], temps[i]);
		solution[i] = (int)tempConvertSolution(modes[i], temps[i]);
		if(studentAnswer[i] == solution[i]) counter++;
	}
	
	VTA.displayScore_I("Temperature Conversion", counter * 5, 50);
	VTA.displayComparison_I(solution, 10, studentAnswer, 10);
}