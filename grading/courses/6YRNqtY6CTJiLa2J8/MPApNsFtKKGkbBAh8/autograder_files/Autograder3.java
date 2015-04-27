import vta.VTA;

public class Autograder3
{
	public static void main(String[] args)
	{
		VTA vta = new VTA("C");
		
		vta.addSection("Code Points");
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10);
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10);

		vta.addSection("Execution Points");

		vta.runWithInput('i', "basketballgame.in");
		vta.runWithInput('s', "basketballgame.in");
		vta.parseCases("basketballgame.in", 1);

		vta.addAutoGradedInput("Execution Points", "basketballgame", "basketballgame.in");
		for(int i = 0; i < vta.correctAnswers.length; i++){
			boolean correct = vta.correctAnswers[i].equals(vta.studentAnswers[i]);
			vta.addInputCase("Execution Points", "basketballgame", vta.correctAnswers[i], 
				vta.studentAnswers[i], correct, 5, correct ? "Yeah good job" : "suckaahhhh!");
		}
		

		vta.cleanUp();
	}
}
