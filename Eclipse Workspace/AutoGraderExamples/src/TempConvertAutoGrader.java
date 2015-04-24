import vta.VTA;

public class TempConvertAutoGrader {

	public static void main(String[] args) {
		VTA v = new VTA("Java");
		
		v.runWithInput('s', "temps.in");
		v.runWithInput('i', "temps.in");
		
		v.parseCases("temps.in", 1);
		
		String sect2name = "Test Cases";
		v.addSection(sect2name);
		v.addAutoGradedInput(sect2name, "Input 1", "temps.in");
		
		for(int i = 0; i < v.correctAnswers.length; i++){
			boolean correct = false;
			if(v.correctAnswers[i].equals(v.studentAnswers[i]))correct = true;
			v.addInputCase(sect2name, "Input 1", v.correctAnswers[i], v.studentAnswers[i], correct, 5, (correct)?"Good Job!":"Try again");
		}
		
		v.cleanUp();
		

	}

}
