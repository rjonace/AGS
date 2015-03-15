#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "VTA.h"
#include "skeletonforstudents.h"

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


bool doesDebbyLikeItSolution(int number)
{
	if(number < 100){
		return (number/10 == number % 10) ? true : false;
	}
	return doesDebbyLikeItSolution(number % 100);
}

const char* moneyManagerSolution(int age, int money)
{
	return (age < 21) ? ((money < 100) ? ("You have some time before you need money.") : ("You have got it made!"))
		   : ((money < 100) ? ("You need to get a job!") : ("You are right on track."));
}

int scholarshipCheckerSolution(double sat, double gpa)
{
	double calc = (sat / 1000) + gpa;
	if (calc < 4){
		return 0;
	}else if(calc < 5){
		return 1000;
	}else if(calc < 6){
		return 2500;
	}else{
		return 5000;
	}
}

int guessingGameSolution(int guess1, int guess2)
{
	
	if (guess1 == guess2){
		return 1;
	}
	else{
		int secret = rand() % 101;
		int g1 = secret - guess1;
		int g2 = secret - guess2;
		
		if (g1 < g2){
			return 1;
		}else if(g2 < g1){
			return 2;
		}else{
			if(guess1 < guess2){
				return 1;
			}else{
				return 2;
			}
		}
	}
}

int bonusCalculatorSolution(int sold)
{
	if(sold < 10){
		return sold * 10;
	}
	if(sold < 20){
		return 100 + ((sold - 10) * 20);
	}
	else{
		return 300 + ((sold - 20) * 40);
	}
}

void lemonadePitchersSolution(char* solution, int tspPer, int lemonsPer, int tsp, int lemons)
{
	int sugarPitchers = tsp / tspPer;
	int lemonPitchers = lemons / lemonsPer;
	int pitchers = sugarPitchers < lemonPitchers ? sugarPitchers : lemonPitchers;
	int sugarLeft = tsp - (tspPer * pitchers);
	int lemonsLeft = lemons - (lemonsPer * pitchers);
	char buffer[512];
	sprintf(buffer, 
		"Pitchers: %d, Sugar Remaining: %d teaspoons, Lemons Remaining: %d", 
		pitchers, sugarLeft, lemonsLeft
	);
}

void buyCerealSolution(char* solution, double company1[], double company2[], int numBoxes)
{
	double cost1;
	double cost2;
	
	if(numBoxes < 101){
		cost1 = numBoxes * company1[0];
		cost2 = numBoxes * company2[0];
	}
	else if(numBoxes < 1101){
		cost1 = (100 * company1[0]) + ((numBoxes - 100) * company1[1]);
		cost2 = (100 * company2[0]) + ((numBoxes - 100) * company2[1]);
	}
	else{
		cost1 = (100 * company1[0]) + (1000 * company1[1]) + ((numBoxes - 1100) * company1[2]);
		cost2 = (100 * company2[0]) + (1000 * company2[1]) + ((numBoxes - 1100) * company2[2]);
	}
	char buffer[512];
	sprintf(solution, 
		"Company Chosen: %d, Cost: $%lf",
		cost1 < cost2 ? 1 : 2, cost1 < cost2 ? cost1 : cost2
	);
}

bool leapYearsSolution(int year)
{
	return (year % 7 == 0 && (year % 35 != 0 || year % 77 != 0)) ? true : false;
}

int restaurantOverlapSolution(int aStart, int aEnd, int bStart, int bEnd)
{
	int end = aEnd < bEnd ? aEnd : bEnd;
	int start = aStart > bStart ? aStart : bStart;
	int overlap = end - start;
	return overlap > 0 ? overlap : 0;
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
	VTA.displayScore("Temperature Conversion", counter * 5, 50);
	VTA.displayComparison_I(solution, 10, studentAnswer, 10);
}