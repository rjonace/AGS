import vta.VTA;

public class Autograder1
{
	public static void main(String[] args)
	{
		VTA vta = new VTA("Java");
		
		vta.addSection("Code Points");
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10);
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10);

		vta.addSection("Execution Points");
		String[][] inputs = {
			{"The hard one", "hopscotch.in"},
			{"The easy one", "hopscotch_easy.in"},
			{"The huge one", "hopscotch_huge.in"}
		};

		for (String[] inputInfo : inputs) {
			String inputDescription = inputInfo[0];
			String inputFilename = inputInfo[1];

			vta.runWithInput('i', inputFilename);
			vta.runWithInput('s', inputFilename);
			vta.parseCases(inputFilename, 1);

			vta.addAutoGradedInput("Execution Points", inputDescription, inputFilename);
			for(int i = 0; i < vta.correctAnswers.length; i++){
				boolean correct = vta.correctAnswers[i].equals(vta.studentAnswers[i]);
				vta.addInputCase("Execution Points", inputDescription, vta.correctAnswers[i], 
					vta.studentAnswers[i], correct, 5, correct ? "Yeah good job" : "suckaahhhh!");
			}
		}

		vta.cleanUp();
	}
}
