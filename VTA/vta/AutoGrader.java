import java.util.Random;

public class AutoGrader {
	
	public static double tempConvertSolution(String mode, double temp){
		return (mode.toUpperCase().equals("F"))? f2CSolution(temp): c2FSolution(temp);
	}
	private static double c2FSolution(double temp){
		return (1.8 * temp) + 32;
	}
	private static double f2CSolution(double temp){
		return (temp - 32) / 1.8;
	}
	
	public static boolean doesDebbyLikeItSolution(int number){
		if(number < 100){
			return (number/10 == number % 10) ? true : false;
		}
		return doesDebbyLikeItSolution(number % 100);
	}
	
	public static String moneyManagerSolution(int age, int money){
		return (age < 21) ? ((money < 100) ? ("You have some time before you need money.") : ("You have got it made!"))
			   : ((money < 100) ? ("You need to get a job!") : ("You are right on track."));
	}
	
	public static int scholarshipCheckerSolution(double sat, double gpa){
		double calc = (sat / 1000) + gpa;
		if (calc < 4){
			return 0;
		}else if(calc < 5){
			return 1000;
		}else if(calc < 6){
			return 2500;
		}else{
			return 5000;
		}
	}
	
	public static int guessingGameSolution(int guess1, int guess2){
		
		if (guess1 == guess2){
			return 1;
		}
		else{
			Random a = new Random();
			int secret = a.nextInt(101);
			int g1 = secret - guess1;
			int g2 = secret - guess2;
			
			if (g1 < g2){
				return 1;
			}else if(g2 < g1){
				return 2;
			}else{
				if(guess1 < guess2){
					return 1;
				}else{
					return 2;
				}
			}
		}
	}
	
	public static int bonusCalculatorSolution(int sold){
		if(sold < 10){
			return sold * 10;
		}
		if(sold < 20){
			return 100 + ((sold - 10) * 20);
		}
		else{
			return 300 + ((sold - 20) * 40);
		}
	}
	
	public static String lemonadePitchersSolution(int tspPer, int lemonsPer, int tsp, int lemons){
		int sugarPitchers = tsp / tspPer;
		int lemonPitchers = lemons / lemonsPer;
		int pitchers = Math.min(sugarPitchers, lemonPitchers);
		int sugarLeft = tsp - (tspPer * pitchers);
		int lemonsLeft = lemons - (lemonsPer * pitchers);
		return "Pitchers: " + pitchers + ", Sugar Remaining: " + sugarLeft + " teaspoons, Lemons Remaining: " + lemonsLeft;
	}
	
	public static String buyCerealSolution(double[] company1, double[] company2, int numBoxes){
		double cost1;
		double cost2;
		
		if(numBoxes < 101){
			cost1 = numBoxes * company1[0];
			cost2 = numBoxes * company2[0];
		}
		else if(numBoxes < 1101){
			cost1 = (100 * company1[0]) + ((numBoxes - 100) * company1[1]);
			cost2 = (100 * company2[0]) + ((numBoxes - 100) * company2[1]);
		}
		else{
			cost1 = (100 * company1[0]) + (1000 * company1[1]) + ((numBoxes - 1100) * company1[2]);
			cost2 = (100 * company2[0]) + (1000 * company2[1]) + ((numBoxes - 1100) * company2[2]);
		}
		return "Company Chosen: " + ((cost1 < cost2) ? 1 : 2) + ", Cost: $" + ((cost1 < cost2) ? cost1 : cost2);	
	}
	
	public static boolean leapYearsSolution(int year){
		return (year % 7 == 0 && (year % 35 != 0 || year % 77 != 0)) ? true : false;
	}
	
	public static int restaurantOverlapSolution(int aStart, int aEnd, int bStart, int bEnd){
		int overlap = (Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
		return (overlap >=0) ? overlap : 0;
	}
	
	public static void main(String[] args){
		
		int counter = 0;
		
		String[] modes = {"f", "c", "f", "f", "c", "f", "f", "c", "f", "c"};
		double[] temps = {212, 100, 100, 98.6, 0, 32, 0, -40, -40, 40};
		
		double[] studentAnswer = new double[10];
		double[] solution = new double[10];
		
		for(int i = 0; i < 10; i++){
			studentAnswer[i] = SkeletonForStudents.tempConvert(modes[i], temps[i]);
			solution[i] = tempConvertSolution(modes[i], temps[i]);
			if(studentAnswer[i] == solution[i]) counter++;
		}
		
		System.out.println(VTA.displayScore("Temperature Conversion", counter * 5, 50));
		System.out.println(VTA.displayComparison(solution, studentAnswer));
		
	}
}
