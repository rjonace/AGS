import java.io.*;
import java.nio.file.Path;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.lang.Runtime;
import java.util.*;

class Score{
	public int score;
	public boolean correct;
}

class Section{

	String name;
	int pointsPossible;
	int pointsEarned;
	ArrayList<SectionRow> rows;
	ArrayList<InputFileGradeData> inputs;
	
	
	public Section(String name){
		this.name = name;
		
		this.pointsEarned = 0;
		this.pointsPossible = 0;
		
		this.rows = new ArrayList<SectionRow>();
		this.inputs = new ArrayList<InputFileGradeData>();
	}
}

class SectionRow{
	
	String description;
	int pointsPossible;
	int pointsEarned;
	String comments;
	
	
	public SectionRow(String description, int points, String comments){
		
		this.description = description;
		this.pointsPossible = points;
		this.pointsEarned = -1;
		this.comments = comments;
		
	}
}

class InputFileGradeData{
	
	String name;
	String contents;
	int pointsPossible;
	int pointsEarned;
	ArrayList<InputCaseData> cases;

	
	public InputFileGradeData(String inputName, String fileName){
		this.name = inputName;
		this.contents = "";
		Scanner in;
		
		try {
			in = new Scanner(new File(fileName));
			
			while(in.hasNextLine()){
				contents += in.nextLine() + "\n";
			}
			
			in.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		
		this.pointsPossible = 0;
		this.pointsEarned = 0;
		
		this.cases = new ArrayList<InputCaseData>();
	}
}

class InputCaseData{
	
	String correctOutput;
	String studentOutput;
	boolean correct;
	int pointsPossible;
	String comments;

	
	public InputCaseData(String correctOutput, String studentOutput, int points, String comments){
		this.correctOutput = correctOutput;
		this.studentOutput = studentOutput;

		correct = correctOutput.equals(studentOutput);

		this.pointsPossible = points;
		this.comments = comments;
	}

	public int getPoints(){
		if(correct){
			return pointsPossible;
		}
		return 0;
	}
}

public class VTA{
	
	ArrayList<Section> sections;

	
	/** No-arg constructor */
	public VTA()
	{
		sections = new ArrayList<Section>();
	}

	/** String[] constructor */
	public VTA(String[] args)
	{
		sections = new ArrayList<Section>();
	}
	
	public void addSection(String name){
		sections.add(new Section(name));
	}
	
	public boolean addManuallyGradedRow(String sectionName, String description, int points, String comments){
		int sectionIndex = -1;
		
		for(Section a : sections){
			if(a.name.equals(sectionName)){
				sectionIndex = sections.indexOf(a);
				break;
			}
		}		
		if(sectionIndex < 0){
			return false;
		}
		
		SectionRow temp = new SectionRow(description, points, comments);
		
		sections.get(sectionIndex).pointsPossible += points;
		sections.get(sectionIndex).rows.add(temp);
		
		return true;
	}
	
	public boolean addAutoGradedInput(String sectionName, String inputName, String fileName){
		int sectionIndex = -1;
		
		for(Section a : sections){
			if(a.name.equals(sectionName)){
				sectionIndex = sections.indexOf(a);
				break;
			}
		}		
		if(sectionIndex < 0){
			return false;
		}
		
		
		InputFileGradeData temp = new InputFileGradeData(inputName, fileName);
		sections.get(sectionIndex).inputs.add(temp);
		
		
		return true;
	}
	public boolean addInputCase(String sectionName, String inputName, String correctOutput, String studentOutput, int points, String comments){
		
		int sectionIndex = -1;
		int inputIndex = -1;
		
		for(Section a : sections){
			if(a.name.equals(sectionName)){
				sectionIndex = sections.indexOf(a);
				break;
			}
		}		
		if(sectionIndex < 0){
			return false;
		}
		
		for(InputFileGradeData a : sections.get(sectionIndex).inputs){
			if(a.name.equals(inputName)){
				inputIndex = sections.get(sectionIndex).inputs.indexOf(a);
				break;
			}
		}		
		if(inputIndex < 0){
			return false;
		}
		
		InputCaseData temp = new InputCaseData(correctOutput, studentOutput, points, comments);
		
		sections.get(sectionIndex).pointsPossible += points;
		sections.get(sectionIndex).pointsEarned += temp.getPoints();
		sections.get(sectionIndex).inputs.get(inputIndex).pointsPossible += points;
		sections.get(sectionIndex).inputs.get(inputIndex).pointsEarned += temp.getPoints();
		
		sections.get(sectionIndex).inputs.get(inputIndex).cases.add(temp);
		
		return true;
	}

	public void cleanUp(){
		createJSON();
		
		
	}
	private void createJSON(){
		String out = "";
		
		out += "{\n" + "\t\"sections\":\n" + "\t[\n";
		
		for(Section a : sections){
			out += "\t\t{\n";
			
			out += "\t\t\t\"sectionName\":";
			out += "\"" + a.name + "\",\n";
			
			out += "\t\t\t\"pointsPossible\":";
			out += a.pointsPossible + ",\n";
			
			out += "\t\t\t\"pointsEarned\":";
			out += a.pointsEarned + ",\n";
			
			out += "\t\t\t\"rows\":\n";
			out += "\t\t\t[\n";
			
			for(SectionRow b : a.rows){
				out += "\t\t\t\t{";
				
				out += "\t\t\t\t\t\"description\":\"";
				out += b.description + "\",\n";
				
				out += "\t\t\t\t\t\"pointsEarned\":";
				out += b.pointsEarned + ",\n";
				
				out += "\t\t\t\t\t\"PointsPossible\":";
				out += b.pointsPossible + ",\n";
				
				out += "\t\t\t\t\t\"comments\":\"";
				out += b.comments + "\"\n";
				
				out += "\t\t\t\t},\n";
			}
			
			out = out.substring(0, (out.length()-2));
			out += "\n";
			
			out += "\t\t\t],\n";
			
			out += "\t\t\t\"gradedInputs\":\n";
			out += "\t\t\t[\n";
			
			for(InputFileGradeData c : a.inputs){
				out += "\t\t\t\t{\n";
				
				out += "\t\t\t\t\t\"name\":\"";
				out += c.name + "\",\n";
				
				out += "\t\t\t\t\t\"contents\":\"";
				out += c.contents + "\",\n";
				
				out += "\t\t\t\t\t\"pointsPossible\":";
				out += c.pointsPossible + ",\n";
				
				out += "\t\t\t\t\t\"pointsEarned\":";
				out += c.pointsEarned + ",\n";
				
				out += "\t\t\t\t\t\"cases\":\n";
				out += "\t\t\t\t\t[\n";
				
				for(InputCaseData d : c.cases){
					out += "\t\t\t\t\t\t{\n";
					
					out += "\t\t\t\t\t\t\t\"correctOutput\":\"";
					out += d.correctOutput + "\",\n";
					
					out += "\t\t\t\t\t\t\t\"studentOutput\":\"";
					out += d.studentOutput + "\",\n";
					
					out += "\t\t\t\t\t\t\t\"correct\":";
					out += d.correct + ",\n";
					
					out += "\t\t\t\t\t\t\t\"points\":";
					out += d.pointsPossible + ",\n";
					
					out += "\t\t\t\t\t\t\t\"comments\":\"";
					out += d.comments + "\",\n";
					
					out += "\t\t\t\t\t\t},\n";					
				}
				
				out = out.substring(0, (out.length()-2));
				out += "\n";
				
				out += "\t\t\t\t},\n";
			}
			
			out = out.substring(0, (out.length()-2));
			out += "\n";
			
			out += "\t\t\t]\n";
			
			out += "\t\t},\n";
		}
		
		out = out.substring(0, (out.length()-2));
		out += "\n";
		
		out += "\t]\n";
		out += "}";
		
		try {
			PrintWriter output = new PrintWriter("autograderOutput.json", "UTF-8");
			output.print(out);
			output.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/** Automatically checks whether stdin was used. 
	 *
	 *  Adds/deducts points to Code Points object based on compliance */
	public void addGradeUseStdin(int points){
		
	}

	/** Automatically checks whether stdout was used
	 *  
	 *  Adds/deducts points to Code Points object based on compliance */
	public void addGradeUseStdout(int points){
		
	}

	/** Adds an entry to the Code Points of the results object that must be manually graded by the TA */
	public void addCodePoints(String description, int points){
		
	}

	/** Returns the total number of instructor created input files that are available;
	 *  Implementation idea: Maybe just put all of the input files in the a directory and run the 
	 *  command: "ls -1 | wc" on it */
	public int numInputFiles(){
		return 0;
	}

	/** Assuming there is one and only one input file, this returns its contents as a string */
	public String getInputFromFile(){
		return "";
	}

	/** Returns the contents of file with inputNumber as a string */
	public String getInputFromFiles(int inputNumber){
		return "";
	}


/*	public Score compareOutputsByLine(final String[] correct_output, final String[] student_output, int total_points, Integer numCases)
	{
		int lineBufferSize = 256;
		int scoresArraySize = 256;

		numCases = 0;
		score_struct* scores = malloc(scoresArraySize * sizeof(score_struct));

		int corrLength = strlen(correct_output);
		int studLength = strlen(student_output);

		int corrPos = 0, studPos = 0;

		while (corrPos < corrLength && studPos < studLength) {
			char corrLine[lineBufferSize], studLine[lineBufferSize];
			corrPos = readStringLine(correct_output, corrLine, corrPos) + 1;
			studPos = readStringLine(student_output, studLine, studPos) + 1;

			scores[*numCases].correct = !strcmp(corrLine, studLine);
			strncpy(scores[*numCases].correct_output, corrLine, lineBufferSize);
			strncpy(scores[*numCases].student_output, studLine, lineBufferSize);

			*numCases = *numCases + 1;
			if (*numCases >= scoresArraySize) {
				scoresArraySize *= 2;
				scores = realloc(scores, scoresArraySize * sizeof(score_struct));
			}
		}

		while (corrPos < corrLength) {
			char corrLine[lineBufferSize];
			corrPos = readStringLine(correct_output, corrLine, corrPos);
			scores[*numCases].correct = false;
			*numCases = *numCases + 1;

			if (*numCases >= scoresArraySize) {
				scoresArraySize *= 2;
				scores = realloc(scores, scoresArraySize *sizeof(score_struct));
			}
		}

		for (int i = 0; i < *numCases; i++) {
			if (scores[i].correct)
				scores[i].points = total_points / *numCases;
		}

		return scores;
	}*/

	/** Returns a string that represents the contents of an input file containing numCases of input cases,
	 *  each of which follows the pattern in the first argument 
	 *  Implementation idea: probably should make the first line the number of cases, and make the beginning of
	 *  each case contain the number of lines for that case */ 
	public String generateInputFile(String pattern, int numCases){
		return "";
	}

	/** Runs either the instructor's or student's compiled binary and returns its stdout as a string; "mode"
	 *  determines which should be run 
	 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
	 *  struct of information about how the file ran---not just the output */
	public String run(char mode){
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



	/** Runs either the instructor's or student's compiled binary with the contents of "input" piped in and 
	 *  returns the stdout as a string; "mode" determines which should be run 
	 *  Implementation idea:  Per Professor Heinrch's suggestion, we should probably return an entire 
	 *  struct of information about how the file ran---not just the output */
	public String runWithInput(char mode, String input){
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

	/** Does a diff comparison of the text in correct_output and student_output, treating each line as a case,
	 *  and distributes the total_points evenly by number of cases
	 *
	 *  Returns an array of score_struct */
	public void compareOutputsByLine(String correct_output, String student_output, int total_points){
		
	}

	/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output, 
	 *  treating each line as a case, and distributes the total_points evenly by number of cases
	 *
	 *  Returns an array of score_struct */
	public void compareOutputsByLineRegex(String regex, String correctOutput, 
		String studentOutput, int totalPoints){
		
	}

	/** Does a diff comparison of the text in correct_output and student_output, treating cases as groups of 
	 *  lines of length case_lines, and distributes the total_points evenly by number of cases
	 *
	 *  Returns an array of score_struct */
	public void compareOutputsByCase(int case_lines, String correctOutput, String studentOutput, 
		int totalPoints){
		
	}

	/** Does a diff comparison of the results of regex capture of the text in correct_output and student_output,
	 *  treating cases as groups of lines of length case_lines, and distributes the total_points evenly by number
	 *  of cases
	 *
	 *  Returns an array of score_struct */
	public void compareOutputsByCaseRegex(int case_lines, String regex, String correctOutput, 
		String studentOutput, int totalPoints){
		
	}

	/** Adds an entry to the Execution Points of the results object with the results of the scores array */
	public void addExecResults(int inputFileNum, String description, String input, 
		String correct_output, String studentOutput, Score scores[]){
		
	}

	/** Checks whether header comment of student source code matches regex */
	public void addCheckHeader(String regex, int points){
		
	}

	/** Adds an entry to the Style Points of the results object that must be manually graded by the TA 
	 *
	 *  Adds/deducts points to Code Points object based on compliance */
	public void addStylePoints(String description, int points){
		
	}
}