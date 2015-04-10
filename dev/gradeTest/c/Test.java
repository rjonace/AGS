//import VTA;
import java.io.*;

public class Test 
{
	public static String run(char mode) throws IOException
	{
		Runtime rt = Runtime.getRuntime();

		String command;
		if (mode == 'i' || mode == 's')
			command = "java -jar Exec" + mode + ".jar";
		else {
			return "Error: Invalid run Mode\n";
		}

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

	public static String runWithInput(char mode, final String inputFileName) throws IOException
	{
		Runtime rt = Runtime.getRuntime();

		String command;
		if (mode == 'i' || mode == 's')
			command = "java -jar Exec" + mode + ".jar < " + inputFileName;
		else {
			return "Error: Invalid run Mode\n";
		}
System.out.println(command);
		Process proc = rt.exec(command);
		BufferedReader stdInput = new BufferedReader(new InputStreamReader(proc.getInputStream()));
		BufferedReader stdError = new BufferedReader(new InputStreamReader(proc.getErrorStream()));

		int bufferSize = 1024;
		StringBuilder outputData = new StringBuilder(bufferSize);
		int pos = 0;
		String curr = null;
		while ((curr = stdInput.readLine()) != null) {
			outputData.append(curr + '\n');
System.out.print(curr);
		    if (++pos >= bufferSize) {
		    	bufferSize *= 2;
		    	StringBuilder tempString = new StringBuilder(bufferSize);
		    	tempString.append(outputData);
		    	outputData = tempString;
		    }
		}

		stdInput.close();		
		
		while ((curr = stdError.readLine()) != null) {
			System.out.println(curr);
		}

		stdError.close();
		return outputData.toString();

	}

	public static void main(String[] args) throws IOException
	{
		System.out.println(run('i'));
		System.out.println(runWithInput('s', "hopscotch.in"));
	}
}
