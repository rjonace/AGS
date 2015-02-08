final class VTA {

	public static String writeTable(int[] a){
		
		String temp="";
		
		int aLength = a.length;
		
		temp += "<table>\n";
		temp += "\t<th>\n";
		temp += "\t\t";
		for(int i = 0; i < aLength; i++){
			temp += "<td>" + (i+1) + "</td> ";
		}
		temp += "\n"; 
		temp += "\t</th>\n\n";
		
		temp += "\t<tr>\n";
		temp += "\t\t";
		for(int i = 0; i < aLength; i++){
			temp += "<td>" + a[i] + "</td> ";
		}
		temp += "\n";
		temp += "\t</tr>\n\n";
		temp += "</table>";
		
		
		return temp;
	}
	
public static String displayComparison(int[] professorAnswers, int[] studentAnswers){
		
		String temp="";
		
		int pLength = professorAnswers.length;
		int sLength = studentAnswers.length;
		boolean lengthsEqual = (pLength == sLength)?true:false;
		
		temp += "<table>\n";
		
		temp += "\t<th>\n";
		
		temp += "\t\t" + "<td>" + "Test Case #" + "</td> " + 
				"<td>" + "Professor Output" + "</td> " +
				"<td>" + "Student Output" + "</td>\n"; 
		
		temp += "\t</th>\n\n";
		
		for(int i = 0; i < pLength; i++){
			
			temp += (lengthsEqual)?((professorAnswers[i] != studentAnswers[i])?
					("\t<tr style=\"background-color:red; color:white;\">\n"):("\t<tr>\n")):
					((i >= sLength)?("\t<tr style=\"background-color:red; color:white;\">\n"):
					((professorAnswers[i] != studentAnswers[i])?
					("\t<tr style=\"background-color:red; color:white;\">\n"):("\t<tr>\n")));
			
			temp += "\t\t" + "<td>" + (i+1) + "</td> " + 
					"<td>" + professorAnswers[i] + "</td> " +
					"<td>" + ((i < sLength)?(studentAnswers[i]):("N/A")) + "</td>" + "\n";
					
			
			temp += "\t</tr>\n\n";
		}
		
		temp += "</table>";
		
		return temp;
	}
	
	
}
