package vta;

import java.util.Random;

public class VTATesterClass {

	public static void main(String[] args) {
		Random a = new Random();
		int[] grades = new int[10];
		
		int gradesLength = grades.length;
		
		for(int i = 0; i < gradesLength; i++){
			grades[i] = a.nextInt(6);
		}
		
		System.out.println(VTA.writeTable(grades));
	}

}
