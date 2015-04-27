import java.util.*;

public class TempConvertSolution {

	public static double tempConvertSolution(String mode, double temp){
		return (mode.toUpperCase().equals("F"))? f2CSolution(temp): c2FSolution(temp);
	}
	private static double c2FSolution(double temp){
		return (1.8 * temp) + 32;
	}
	private static double f2CSolution(double temp){
		return (temp - 32) / 1.8;
	}
	
	public static void main(String[] args){
		Scanner in = new Scanner(System.in);
		
		int numCases = in.nextInt();
		
		for(int i = 0; i < numCases; i++){
			System.out.printf("%.2f%n",tempConvertSolution(in.next(),in.nextDouble()));
		}
		
		in.close();
	}
}