import java.util.Random;

public class VTATesterClass {

	public static void main(String[] args) {
		Random a = new Random();
		int[] grades = new int[10];
		int[] sAns = {1,2,3,4,6};
		int[] pAns = {1,2,3,4,5,6,7};
		
		int gradesLength = grades.length;
		
		for(int i = 0; i < gradesLength; i++){
			grades[i] = a.nextInt(6);
		}
		
		System.out.println(VTA.writeTable(grades));
		System.out.println(VTA.displayComparison(pAns, sAns));
	}

}
