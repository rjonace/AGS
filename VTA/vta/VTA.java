final class VTA {

	
	public static String displayComment(String comment){
		
		String temp="";
		
		temp += "<p>\n";
		temp += "\t";
		temp +=	comment;
		temp += "\n";
		temp += "</p>";
		
		return temp;
	}
	
	public static String displayScore(String title, int pointsEarned, int pointsPossible){
		return displayComment(scoreWrapper(title, pointsEarned, pointsPossible));
	}
	
	private static String scoreWrapper(String title, int pointsEarned, int pointsPossible){
		return title + ": " + pointsEarned + "/" + pointsPossible;		
	}
	
	public static String displayScores(String[] titles, int[] pointsEarned, int[] pointsPossible){
		String temp = "";
		
		for(int i = 0; i < titles.length; i++){
			temp += scoreWrapper(titles[i], pointsEarned[i], pointsPossible[i]) + "\n" + "\t";
		}
		
		temp = temp.substring(0, temp.length() - 2);
		
		return displayComment(temp);
	}
	
	public static String displayTable(int[] array){
		
		String temp="";
		
		int aLength = array.length;
		
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
			temp += "<td>" + array[i] + "</td> ";
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
					"<td>" + ((i < sLength)?(studentAnswers[i]):("N/array")) + "</td>" + "\n";
					
			
			temp += "\t</tr>\n\n";
		}
		
		temp += "</table>";
		
		return temp;
	}
	
	public static String displayComparison(double[] professorAnswers, double[] studentAnswers){
		
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
					"<td>" + ((i < sLength)?(studentAnswers[i]):("N/array")) + "</td>" + "\n";
					
			
			temp += "\t</tr>\n\n";
		}
		
		temp += "</table>";
		
		return temp;
	}
	
	public static String displayComparison(String[] professorAnswers, String[] studentAnswers){
		
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
			
			temp += (lengthsEqual)?((!professorAnswers[i].equals(studentAnswers[i]))?
					("\t<tr style=\"background-color:red; color:white;\">\n"):("\t<tr>\n")):
					((i >= sLength)?("\t<tr style=\"background-color:red; color:white;\">\n"):
					((!professorAnswers[i].equals(studentAnswers[i]))?
					("\t<tr style=\"background-color:red; color:white;\">\n"):("\t<tr>\n")));
			
			temp += "\t\t" + "<td>" + (i+1) + "</td> " + 
					"<td>" + professorAnswers[i] + "</td> " +
					"<td>" + ((i < sLength)?(studentAnswers[i]):("N/array")) + "</td>" + "\n";
					
			
			temp += "\t</tr>\n\n";
		}
		
		temp += "</table>";
		
		return temp;
	}

	
}
