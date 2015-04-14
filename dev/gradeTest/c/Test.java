import java.io.*;
import vta.VTA;

public class Test 
{
	public static void main(String[] args) throws IOException
	{
		VTA vta = new VTA();
		//vta.run('i');

		//vta.parceCases(String regex);
		vta.addSection("Code Points");
		vta.addSection("Execution Points");
		
		
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10, "Edit this comment");
	
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10, "Edit this comment");
	

		vta.addAutoGradedInput("Execution Points", "The hard one", "inputTest.txt");

		int numCases = 10;

		String[] studentAnswers = {"a", "b", "c", "a", "b", "c", "a", "b", "c", "a"};
		String[] correctAnswers = {"a", "b", "c", "d", "a", "b", "c", "d", "c", "a"};
		

		for(int i = 0; i < numCases; i++){
//			studentAnswers[i] = //Some Manipulation of vta.studentoutput to get 1 case
//			correctAnswers[i] = //Some manipulation of vta.correctoutput to get 1 case 
		}
		
		
		for (int i = 0; i < numCases; i++) {
			vta.addInputCase("Execution Points", "The hard one", studentAnswers[i],
								correctAnswers[i], 50 / numCases, "good job");
	
		}
	
		vta.cleanUp();		
	}
}
