import java.io.*;
import vta.VTA;

public class Test 
{
	public static void main(String[] args) throws IOException
	{
		VTA vta = new VTA();
		
		vta.addSection("Code Points");
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10, "Edit this comment");
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10, "Edit this comment");

		vta.addSection("Execution Points");
	
		vta.runWithInput('i', "hopscotch.in");
		vta.runWithInput('s', "hopscotch.in");
		vta.parseCases("hopscotch.in", 1);

		vta.addAutoGradedInput("Execution Points", "The hard one", "hopscotch.in");
		for(int i = 0; i < vta.correctAnswers.length; i++){
			boolean correct = vta.correctAnswers[i].equals(vta.studentAnswers[i]);
			String comment = correct ? "Yeah good job" : "suckaahhhh!";

			vta.addInputCase("Execution Points", "The hard one", vta.studentAnswers[i],
				vta.correctAnswers[i], correct,  5, comment);
		}
	
		vta.cleanUp();		
	}
}
