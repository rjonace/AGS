package vta;

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
	String contentsFileName;
	int pointsPossible;
	int pointsEarned;
	ArrayList<InputCaseData> cases;

	
	public InputFileGradeData(String inputName, String fileName){
		this.name = inputName;
		this.contentsFileName = fileName;
		
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

	
	public InputCaseData(String correctOutput, String studentOutput, boolean correct, int points, String comments){
		this.correctOutput = correctOutput;
		this.studentOutput = studentOutput;

		this.correct = correct;

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
	HashMap<String, String> correctOutputText;
	HashMap<String, String> studentOutputText;
	char language;

	public String[] correctAnswers;
	public String[] studentAnswers;
	public int numCases;

	
	/** No-arg constructor */
	public VTA(String language)
	{
		if (language.trim().equalsIgnoreCase("C"))
			this.language = 'C';
		else if (language.trim().equalsIgnoreCase("Java"))
			this.language = 'J';
//		else
//			throw (new Exception("Unknown Language"));

		sections = new ArrayList<Section>();
		correctOutputText = new HashMap<String,String>();
		studentOutputText = new HashMap<String, String>();
	}

	/** String[] constructor */
	public VTA(String[] args)
	{
		sections = new ArrayList<Section>();
		correctOutputText = new HashMap<String,String>();
		studentOutputText = new HashMap<String, String>();
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

<<<<<<< HEAD
	public boolean addAutoGradedInput(String sectionName, String fileName){
		return addAutoGradedInput(sectionName, "No input file", "No input file");
	}


=======
	public boolean addAutoGradedInput(String sectionName){
		return addAutoGradedInput(sectionName, "No input file", "No input file");
	}

>>>>>>> a0bf52ef5b6f6390dfb71b0deb00ae22c580fb87
	public boolean addInputCase(String sectionName, String inputName, String correctOutput, String studentOutput, boolean correct, int points, String comments){
		
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
		
		InputCaseData temp = new InputCaseData(correctOutput, studentOutput, correct, points, comments);
		
		sections.get(sectionIndex).pointsPossible += points;
		sections.get(sectionIndex).pointsEarned += temp.getPoints();
		sections.get(sectionIndex).inputs.get(inputIndex).pointsPossible += points;
		sections.get(sectionIndex).inputs.get(inputIndex).pointsEarned += temp.getPoints();
		
		sections.get(sectionIndex).inputs.get(inputIndex).cases.add(temp);
		
		return true;
	}

	public boolean addInputCase(String sectionName, String correctOutput, String studentOutput, boolean correct, int points, String comments){
<<<<<<< HEAD
		return addInputCase(sectionName, "No input file", correctOutput, studentOutput, correct, points, comments);
	}


=======
		return addInputCase(sectionName, "No input file",  correctOutput, studentOutput, correct, points, comments){
	}

>>>>>>> a0bf52ef5b6f6390dfb71b0deb00ae22c580fb87
	public void cleanUp(){
		createJSON();	
	}

	private void createJSON(){
		StringBuilder out = new StringBuilder();
		
		out.append("{" + "\"sections\":" + "[");
		boolean sectionsRan = false, rowsRan = false, inputsRan = false, casesRan = false;
		
		for(Section a : sections){
			sectionsRan = true;
			out.append("{");
			
			out.append("\"sectionName\":");
			out.append("\"" + a.name + "\",");
			
			out.append("\"pointsPossible\":");
			out.append(a.pointsPossible + ",");
			
			out.append("\"pointsEarned\":");
			out.append(a.pointsEarned + ",");
			
			out.append("\"rows\":");
			out.append("[");
			
			for(SectionRow b : a.rows){
				rowsRan = true;
				out.append("{");
				
				out.append("\"description\":\"");
				out.append(b.description + "\",");
				
				out.append("\"pointsEarned\":");
				out.append(b.pointsEarned + ",");
				
				out.append("\"PointsPossible\":");
				out.append(b.pointsPossible + ",");
				
				out.append("\"comments\":\"");
				out.append(b.comments + "\"");
				
				out.append("},");
			}
			if(rowsRan){
				out.deleteCharAt(out.length() - 1);
				rowsRan = false;
			}
			
			out.append("],");
			
			out.append("\"gradedInputs\":");
			out.append("[");
			
			for(InputFileGradeData c : a.inputs){
				inputsRan = true;
				out.append("{");
				
				out.append("\"name\":\"");
				out.append(c.name + "\",");
				
				out.append("\"contents\":\"");
				out.append(c.contentsFileName + "\",");
				
				out.append("\"pointsPossible\":");
				out.append(c.pointsPossible + ",");
				
				out.append("\"pointsEarned\":");
				out.append(c.pointsEarned + ",");
				
				out.append("\"cases\":");
				out.append("[");
				
				for(InputCaseData d : c.cases){
					casesRan = true;
					out.append("{");
					
					out.append("\"correctOutput\":\"");
					out.append(d.correctOutput + "\",");
					
					out.append("\"studentOutput\":\"");
					out.append(d.studentOutput + "\",");
					
					out.append("\"correct\":");
					out.append(d.correct + ",");
					
					out.append("\"points\":");
					out.append(d.pointsPossible + ",");
					
					out.append("\"comments\":\"");
					out.append(d.comments + "\"");
					
					out.append("},");					
				}
				if(casesRan){
					out.deleteCharAt(out.length() - 1);
					casesRan = false;
				}
				
				out.append("]");
				out.append("},");
			}
			
			if(inputsRan){
				out = out.deleteCharAt(out.length() - 1);
				inputsRan = false;
			}
			
			out.append("]");
			
			out.append("},");
		}
		
		if(sectionsRan){
			out.deleteCharAt((out.length() - 1));
			sectionsRan = false;
		}
		
		out.append("]");
		out.append("}");
		
		try {
			PrintWriter output = new PrintWriter("feedback.json", "UTF-8");
			output.print(out);
			output.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public boolean parseCases(int numLinesPerCase){
		return parseCases("No input case", numLinesPerCase);
	}

	
	public boolean parseCases(String inputFilename, int numLinesPerCase){
		String[] instructorTemp = correctOutputText.get(inputFilename).split("\n");
		String[] studentTemp = studentOutputText.get(inputFilename).split("\n");

		numCases = instructorTemp.length/numLinesPerCase;

		this.correctAnswers = new String[numCases];
		this.studentAnswers = new String[numCases];

		Arrays.fill(correctAnswers, "");
		Arrays.fill(studentAnswers, "");


		for(int i = 0, k = 0; i < instructorTemp.length - numLinesPerCase + 1 && k < numCases; i += numLinesPerCase, k++){
			for(int j = 0; j < numLinesPerCase; j++){
				correctAnswers[k] += instructorTemp[i+j];
				if(i+j < studentTemp.length)studentAnswers[k] += studentTemp[i+j];
			}
		}

		return true;
	}

	public boolean run(char mode){
		if (!(mode == 'i' || mode == 's'))
			return false;
		if (!(this.language == 'C' || this.language == 'J'))
			return false;

		Runtime rt = Runtime.getRuntime();

		String command;
		if (this.language == 'C')
			command = "./exec" + mode;
		else
			command = "java -jar exec" + mode;


		try {
			Process proc = rt.exec(command);
			
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(proc.getInputStream()));
			BufferedReader stdError = new BufferedReader(new InputStreamReader(proc.getErrorStream()));
			
			StringBuilder outputData = new StringBuilder(4096);
			int pos = 0;
			String curr = null;
			while ((curr = stdInput.readLine()) != null) {
				outputData.append(curr ).append('\n');
			}

			stdInput.close();		
			
			if (mode == 'i') {
				correctOutputText.put("No input file", outputData.toString());
			}
			else {
				studentOutputText.put("No input file", outputData.toString());
			}
		} 
		catch (IOException e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}

	public boolean runWithInput(char mode, String inputFileName){
		if (!(mode == 'i' || mode == 's'))
			return false;
		if (!(this.language == 'C' || this.language == 'J'))
			return false;

		Runtime rt = Runtime.getRuntime();

		String[] command = {"/bin/sh", "-c", ""};
		if (this.language == 'C') {
			command[2] =  "./exec" + mode + " <" + inputFileName;
		}
		else
			command[2] = "java -jar exec" + mode + " < " + inputFileName;
		
		try {
			Process proc = rt.exec(command);
			BufferedReader stdInput = new BufferedReader(new InputStreamReader(proc.getInputStream()));
			BufferedReader stdError = new BufferedReader(new InputStreamReader(proc.getErrorStream()));

			int bufferSize = (int)(new File(inputFileName)).length();
			StringBuilder outputData = new StringBuilder(bufferSize);
			int pos = 0;
			String curr = null;
			while ((curr = stdInput.readLine()) != null) {
				outputData.append(curr ).append('\n');
			}

			stdInput.close();

			
			if (mode == 'i'){
				correctOutputText.put(inputFileName, outputData.toString());
			}
			else {
				studentOutputText.put(inputFileName, outputData.toString());
			}
		}
		catch (IOException e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}
}