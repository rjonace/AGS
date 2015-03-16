#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "VTA.h"

int main( int argc, const char* argv[] )
{
	// Code Points
	VTA.addGradeUseStdin(5);
	VTA.addGradeUseStdout(5);
	VTA.addCodePoints("Reads in all input", 5);
	VTA.addCodePoints("Follows output format", 5);	// We can auto-grade this with a regex, I think
	VTA.addCodePoints("Has a queue struct", 5);
	VTA.addCodePoints("Has enqueue", 5);
	VTA.addCodePoints("Has dequeue", 5);

	// Execution Points
	for (int i = 0; i < VTA.numInputFiles(); i++) {
		char* input = VTA.getInputN(i);
		char* correct_output = VTA.runWithInput('i', input);
		char* student_output = VTA.runWithInput('s', input);
		int scores[] = VTA.compareOutputsByLine(correct_output, student_output, 50);
		VTA.addExecResults(i, input, correct_output, student_output, scores); 
	}

	// Style Points
	VTA.addStylePoints("Header comment w/name, program, date", 4);
	VTA.addStylePoints("Appropriate variable names", 2);
	VTA.addStylePoints("Appropriate use of white space", 2);
	VTA.addStylePoints("Appropriate indenting", 2);
	VTA.addStylePoints("Comments in code", 5);
}