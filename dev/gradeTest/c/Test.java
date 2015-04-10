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
	}

	public static void main(String[] args) throws IOException
	{
		System.out.println(run('i'));
	}
}
