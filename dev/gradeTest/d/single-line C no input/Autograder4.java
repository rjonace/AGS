import vta.VTA;

public class Autograder4
{
	public static void main(String[] args)
	{
		VTA vta = new VTA("C");
		
		vta.addSection("Code Points");
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10);
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10);

		vta.addSection("Execution Points");

		vta.run('i');
		vta.run('s');
		vta.parseCases(1);

		vta.addAutoGradedInput("Execution Points", "no input", "no input");
		for(int i = 0; i < vta.correctAnswers.length; i++){
			boolean correct = vta.correctAnswers[i].equals(vta.studentAnswers[i]);
			vta.addInputCase("Execution Points", "no input", vta.correctAnswers[i], 
				vta.studentAnswers[i], correct, 5, correct ? "Yeah good job" : "suckaahhhh!");
		}
		
		vta.cleanUp();
	}
}
