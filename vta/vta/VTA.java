package vta;

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
	
	
	
}
