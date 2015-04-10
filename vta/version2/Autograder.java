import VTA;

public class Autograder
{
	public static void main(String[] args)
	{
		VTA vta = new VTA(args);

		// Code Points
		vta.addGradeUseStdin(5);
		vta.addGradeUseStdout(5);
		vta.addCodePoints("Reads in all input", 5);
		vta.addCodePoints("Follows output format", 5);	// We can auto-grade this with a regex, I think
		vta.addCodePoints("Has a queue struct", 5);
		vta.addCodePoints("Has enqueue", 5);
		vta.addCodePoints("Has dequeue", 5);

		// Execution Points
		for (int i = 0; i < vta.numInputFiles(); i++) {
			char* input = vta.getInputFromFiles(i);

			char* correct_output = vta.runWithInput('i', input);
			char* student_output = vta.runWithInput('s', input); // struct

			score_struct* scores = vta.compareOutputsByLine(correct_output, student_output, 50);
			vta.addExecResults(i, input, correc t_output, student_output, scores);
			
			free(input);
			free(correct_output);
			free(student_output);
			free(scores);
		}

		// Style Points
		vta.addCheckHeader(HEADER_REGEX, 4);
		vta.addStylePoints("Appropriate variable names", 2);
		vta.addStylePoints("Appropriate use of white space", 2);
		vta.addStylePoints("Appropriate indenting", 2);
		vta.addStylePoints("Comments in code", 5);
	}
}