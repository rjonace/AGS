import java.io.*;
import vta.VTA;

public class Test 
{
	public static String run(char mode) throws IOException
	{
		if (!(mode == 'i' || mode == 's'))
			return "Error: Invalid run Mode\n";

		Runtime rt = Runtime.getRuntime();
		String command = "java -jar Exec" + mode + ".jar";

		try {
			Process proc = rt.exec(command);
			
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(proc.getInputStream()));
			BufferedReader stdError = new BufferedReader(new InputStreamReader(proc.getErrorStream()));
			
			int bufferSize = 1024;
			StringBuilder outputData = new StringBuilder(bufferSize);
			int pos = 0;
			int curr;
			while ((curr = stdInput.read()) != -1) {
				outputData.append((char)curr);

			    if (++pos >= bufferSize) {
			    	bufferSize *= 2;
			    	StringBuilder tempString = new StringBuilder(bufferSize);
			    	tempString.append(outputData);
			    	outputData = tempString;
			    }
			}

			stdInput.close();		
			
			return outputData.toString();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return "Exception";
	}

	public static String runWithInput(char mode, final String inputFileName) throws IOException
	{
		if (!(mode == 'i' || mode == 's'))
			return "Error: Invalid run Mode\n";

		Runtime rt = Runtime.getRuntime();
		String command[] = {"/bin/sh", "-c","java -jar Exec" + mode + ".jar < " + inputFileName};
		
		try {
			Process proc = rt.exec(command);
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(proc.getInputStream()));
			BufferedReader stdError = new BufferedReader(new InputStreamReader(proc.getErrorStream()));

			int bufferSize = 1024;
			StringBuilder outputData = new StringBuilder(bufferSize);
			int pos = 0;
			String curr = null;
			while ((curr = stdInput.readLine()) != null) {
				outputData.append(curr + '\n');
			    if (++pos >= bufferSize) {
			    	bufferSize *= 2;
			    	StringBuilder tempString = new StringBuilder(bufferSize);
			    	tempString.append(outputData);
			    	outputData = tempString;
			    }
			}

			stdInput.close();
			
			return outputData.toString();
		}
		catch (IOException e) {
			e.printStackTrace();
		}

		return "Exception";
	}

	public static void main(String[] args) throws IOException
	{
//		System.out.println(run('i'));
//		System.out.println(runWithInput('s', "hopscotch.in"));
int j = 1;
		VTA vta = new VTA();
System.out.println(j++);
		vta.addSection("Code Points");
System.out.println(j++);
		vta.addSection("Execution Points");
System.out.println(j++);		
		
		vta.addManuallyGradedRow("Code Points", "Uses stdin", 10, "Edit this comment");
System.out.println(j++);		
		vta.addManuallyGradedRow("Code Points", "Uses stdout", 10, "Edit this comment");
System.out.println(j++);		

System.out.println(vta.addAutoGradedInput("Execution Points", "The hard one", "basketballgame.in"));
System.out.println(j++);		
		int numCases = 10;
		// studentoutput, instructoroutput
		int counter = 0;
		for (int i = 0; i < numCases; i++) {
			vta.addInputCase("Execution Points", "The hard one", 
				counter % 2 == 0 ? "corr" + i : "same",
				counter++ % 2 == 0 ? "stud" + i : "same",
				50 / numCases,
				"good job"
			);
System.out.println(j++);		
		}
	
		vta.cleanUp();		
System.out.println(j++);		
	}
}
