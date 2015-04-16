import java.io.*;
import vta.VTA;

public class Autograder
{
	public static void main(String[] args) throws IOException
	{
		VTA vta = new VTA();
		
		vta.addSection("Code Points");
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10, "Edit this comment");
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10, "Edit this comment");

		vta.addSection("Execution Points");
		String[][] inputs = {
			{"The hard one", "hopscotch.in"},
			{"The easy one", "hopscotch_easy.in"}
		};

		for (String[] inputInfo : inputs) {
			String inputDescription = inputInfo[0];
			String inputFilename = inputInfo[1];

			vta.addAutoGradedInput("Execution Points", inputDescription, inputFilename);
			vta.runWithInput('i', inputFilename);
			vta.runWithInput('s', inputFilename);
			vta.parseCases(inputFilename, 1);

			for(int i = 0; i < vta.correctAnswers.length; i++){
				boolean correct = vta.correctAnswers[i].equals(vta.studentAnswers[i]);
				vta.addInputCase("Execution Points", inputDescription, vta.studentAnswers[i],
					vta.correctAnswers[i], correct,  5, correct ? "Yeah good job" : "suckaahhhh!");
			}
		}

		vta.cleanUp();	
	}
}
