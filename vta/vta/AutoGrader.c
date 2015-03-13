#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "VTA.h"
#include "SkeletonForStudents.h"

double tempConvertSolution(char mode, double temp)
{
	return toupper(mode) == 'F' ? f2CSolution(temp): c2FSolution(temp);
}

double c2FSolution(double temp)
{
	return (1.8 * temp) + 32;
}

double f2CSolution(double temp)
{
	return (temp - 32) / 1.8;
}


int main( int argc, const char* argv[] )
{
	int counter = 0;
	
	String modes[] = {'f', 'c', 'f', 'f', 'c', 'f', 'f', 'c', 'f', 'c'};
	double temps[] = {212, 100, 100, 98.6, 0, 32, 0, -40, -40, 40};
	
	double studentAnswer[10];
	double solution[10];
	
	for(int i = 0; i < 10; i++){
		studentAnswer[i] = tempConvert(modes[i], temps[i]);
		solution[i] = tempConvertSolution(modes[i], temps[i]);
		if(studentAnswer[i] == solution[i]) counter++;
	}
	
	VTA.displayScore_I("Temperature Conversion", counter * 5, 50);
	VTA.displayComparison_I(solution, studentAnswer);
}