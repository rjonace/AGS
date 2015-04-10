import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.nio.file.Path;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.io.BufferedReader;

import java.lang.Runtime;

class Score
{
	public int score;
	public boolean correct;
}

public class VTA
{


	/** No-arg constructor */
	public VTA()
	{
		
	}

	/** String[] constructor */
	public VTA(String[] args)
	{

	}

	/** Automatically checks whether stdin was used. 
	 *
	 *  Adds/deducts points to Code Points object based on compliance */
	public void addGradeUseStdin(int points);

	/** Automatically checks whether stdout was used
	 *  
	 *  Adds/deducts points to Code Points object based on compliance */
	public void addGradeUseStdout(int points);

	/** Adds an entry to the Code Points of the results object that must be manually graded by the TA */
	public void addCodePoints(const char* description, int points);

	/** Returns the total number of instructor created input files that are available;
	 *  Implementation idea: Maybe just put all of the input files in the a directory and run the 
	 *  command: "ls -1 | wc" on it */
	public int numInputFiles(void);

	/** Assuming there is one and only one input file, this returns its contents as a string */
	public String getInputFromFile(void);

	/** Returns the contents of file with inputNumber as a string */
	public String getInputFromFiles(int inputNumber);

	/** Returns a string that represents the contents of an input file containing numCases of input cases,
	 *  each of which follows the pattern in the first argument 
	 *  Implementation idea: probably should make the first line the number of cases, and make the beginning of
	 *  each case contain the number of lines for that case */ 
	public String generateInputFile(const char* pattern, int numCases);

	/** Runs either the instructor's or student's compiled binary and returns its stdout as a string; "mode"
	 *  determines which should be run 
	 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
	 *  struct of information about how the file ran---not just the output */
	public String run(char mode)
	{
		Runtime rt = Runtime.getRuntime();

		String command;
		if (mode == 'i' || mode == 's')
			command = "java Exec" + mode;
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



	/** Runs either the instructor's or student's compiled binary with the contents of "input" piped in and 
	 *  returns the stdout as a string; "mode" determines which should be run 
	 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
	 *  struct of information about how the file ran---not just the output */
	public String runWithInput(char mode, char* input);

	/** Does a diff comparison of the text in correct_output and student_output, treating each line as a case,
	 *  and distributes the total_points evenly by number of cases
	 *
	 *  Returns an array of score_struct */
	score_struct* compareOutputsByLine(const char* correct_output, const char* student_output, int total_points);

	/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output, 
	 *  treating each line as a case, and distributes the total_points evenly by number of cases
	 *
	 *  Returns an array of score_struct */
	score_struct* compareOutputsByLineRegex(const char* regex, const char* correct_output, 
		const char* student_output, int total_points);

	/** Does a diff comparison of the text in correct_output and student_output, treating cases as groups of 
	 *  lines of length case_lines, and distributes the total_points evenly by number of cases
	 *
	 *  Returns an array of score_struct */
	score_struct* compareOutputsByCase(int case_lines, const char* correct_output, const char* student_output, 
		int total_points);

	/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output,
	 *  treating cases as groups of lines of length case_lines, and distributes the total_points evenly by number
	 *  of cases
	 *
	 *  Returns an array of score_struct */
	score_struct* compareOutputsByCaseRegex(int case_lines, const char* regex, const char* correct_output, 
		const char* student_output, int total_points);

	/** Adds an entry to the Execution Points of the results object with the results of the scores array */
	void addExecResults(int input_file_num, const char* description, const char* input, 
		const char* correct_output, const char* student_output, score_struct scores[]);

	/** Checks whether header comment of student source code matches regex */
	void addCheckHeader(const char* regex, int points);

	/** Adds an entry to the Style Points of the results object that must be manually graded by the TA 
	 *
	 *  Adds/deducts points to Code Points object based on compliance */
	void addStylePoints(const char* description, int points);
}