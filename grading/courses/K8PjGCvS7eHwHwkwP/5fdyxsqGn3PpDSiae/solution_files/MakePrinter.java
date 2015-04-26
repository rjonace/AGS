// Arup Guha
// 6/15/2010
// Used to make data for program #2

public class MakePrinter {
	
	
	public static void main(String[] args) {
		
		/*
		// Test Max Case
		System.out.println("1000");
		
		for (int i=1; i<=1000; i++) {
			System.out.println((3*i)+" Job"+i+" 10 999");
		}
		*/
		
		/*
		// Test giving opposite priorities
		System.out.println("100");
		for (int i=1; i<=100; i++)
			System.out.println(i+" Job"+i+" "+(101-i)+" 999");
		*/
		
		/*
		for (int i=1; i<=500; i++) {
			System.out.println((3*i)+" Job"+i+" "+((int)(1+99*Math.random()))+" "+((int)(1+50*Math.random())));
		}
		*/
		
		int time = 5;
		for (int i=1; i<=243; i++) {
			time += (int)(1+100*Math.random());
			System.out.println(time+" Job"+i+" "+((int)(1+99*Math.random()))+" "+((int)(1+500*Math.random())));
		}
	}
}