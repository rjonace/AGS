import vta.VTA;

public class PrintJobAutoGrader {
	
	public static void main(String[] args){
		VTA v = new VTA("Java");
				
		String sect1name = "Code Points";
		v.addSection(sect1name);
		v.addManuallyGradedRow(sect1name, "Declare Heap", 10);
		v.addManuallyGradedRow(sect1name, "Coding Practices", 10);
		
		String sect2name = "Test Cases";
		v.addSection(sect2name);
		v.addAutoGradedInput(sect2name, "Input 1", "printer.txt");
		
		v.runWithInput('s', "printer.txt");
		v.runWithInput('i', "printer.txt");
		
		v.parseCases(1);
		
		for(int i = 0; i < v.correctAnswers.length; i++){
			if(v.correctAnswers[i].equals("\n"))continue;
			if(v.correctAnswers[i].substring(0, 10).equals("Printer #"))continue;
			boolean correct = false;
			if(v.correctAnswers[i].equals(v.studentAnswers[i]))correct = true;
			v.addInputCase(sect2name, "Input 1", v.correctAnswers[i], v.studentAnswers[i], correct, 4, (correct)?"Good Job!":"Try again");
		}
		
		String sect3name = "Documentation and Style";
		v.addSection(sect3name);
		v.addManuallyGradedRow(sect3name, "Header Comment", 2);
		v.addManuallyGradedRow(sect3name, "White Space", 2);
		v.addManuallyGradedRow(sect3name, "Variable Names", 2);
		v.addManuallyGradedRow(sect3name, "Indenting", 2);
		v.addManuallyGradedRow(sect3name, "Comments", 2);
		
		String sect4name = "Student Test Cases";
		v.addSection(sect4name);
		v.addManuallyGradedRow(sect4name, "1 Print Job", 3);
		v.addManuallyGradedRow(sect4name, "1000 Print Jobs", 3);
		v.addManuallyGradedRow(sect4name, "All Priorities Equal", 3);
		v.addManuallyGradedRow(sect4name, "1 Job, empty, 1 more Job", 3);
		v.addManuallyGradedRow(sect4name, "All jobs go in queue before any finish", 3);
		v.addManuallyGradedRow(sect4name, "Time ~28,000", 3);
		v.addManuallyGradedRow(sect4name, "Random Data", 3);
		v.addManuallyGradedRow(sect4name, "Every Priority Tested", 3);
		v.addManuallyGradedRow(sect4name, "All cases follow input specs.", 3);
		v.addManuallyGradedRow(sect4name, "Full range of pages is tested", 3);
	}
}
