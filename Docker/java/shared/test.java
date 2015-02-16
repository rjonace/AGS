import java.io.File;
import java.io.IOException;
import java.util.Scanner;

/* MaxSum Solution
 * CS2 - Programming Assignment 1
 * 
 * Adapted from C++ code for programming contest
 * This is the THETA(n^3) solution.
 * Andy Schwartz
 * 5/31/2007
 */


public class MaxSum {
	
	 

	//constants:
	public static final boolean TIMING = false; // Used to print out extra timing information
	
	private static final double MilliSecsPerTest = 2000.0;//how many second should the test run in order to get a good avg time
	//this is used so the smaller tests will be repeated enough to get a good read on the time
	private static final int MinValueInCell = -127;//used to initiate a max
	
	//instance variables:
	private int [][][]listOfBoxes;//holds all the boxes given in the input
	
	///////////////////////////////////////////////////////////////////////
	//instance methods:
	
	public MaxSum (String filename){
		//constructs a MaxSum object which can be run on the given input
		//Note reading the input is only O(n^2) opertions per square matrix
		try {
			Scanner fIn = new Scanner (new File(filename));
			//read the input:
			int numBoxes = fIn.nextInt();
			listOfBoxes = new int[numBoxes][][];
			for (int i = 0; i < numBoxes; i++){
				int sizeOfBox = fIn.nextInt();
				int [][]currentBox = new int [sizeOfBox][sizeOfBox];
				for (int x = 0; x < sizeOfBox; x++){
					for (int y = 0; y < sizeOfBox; y++){
						currentBox[x][y] = fIn.nextInt();
					}
					//fIn.nextLine();//just to make sure we're at next line
				}
				listOfBoxes[i] = currentBox;
			}
		} catch (IOException e) {
			//either unable to open file or some input was unexpected
			System.err.println("unable to open/read file: " + filename);
			e.printStackTrace();
			System.exit(0);
		}
	}
	

	public void timeExecution(){
		//run on each box:
		for (int i = 0; i < listOfBoxes.length; i++){
			double totalTime = 0;
			int iterations = 0; //used to track iterations in order tofind avg time
			int answer = 0;
			
			if (TIMING) {
			
				while (totalTime < MilliSecsPerTest){
					//time each iteration:
					double startTime = System.currentTimeMillis();
					answer = findMaxQuick(listOfBoxes[i]);
					double endTime = System.currentTimeMillis();
					totalTime += (endTime - startTime);//add to time
					iterations++;//add to iterations so we can find acerage
				}
			}
			else {
				answer = findMaxQuick(listOfBoxes[i]);
			}
			
			if (TIMING) {
			
				//print results:
				System.out.println("\nTest Case #" + (i+1));
				System.out.println("  N: "+ listOfBoxes[i].length);
				System.out.println("  Answer: "+answer);
				System.out.println("  Millisecond: " +totalTime + " (" + iterations + " iterations)");
				System.out.println("  Avg Time: " +(totalTime/iterations));
			}
			else {
				System.out.println("Test case #" + (i+1) + ": The maximal sum is " + answer + ".");
			}
		}
	}
	
	public String toString(){
		String str = "";
		for (int i = 0; i < listOfBoxes.length; i++){
			str += listOfBoxes[i].length + "\n";
			for (int x = 0; x < listOfBoxes[i].length; x++){
				for (int y = 0; y < listOfBoxes[i][x].length; y++){
					str += listOfBoxes[i][x][y] + " ";
				}
				str +="\n";
			}
			str +="\n\n";
		}
		return str;
	}
	
	/////////////////////////////////////////////////////////////////////
	//static methods: 
	
	public static int findMaxQuick(int [][]box){
		//this runs the actual O(n^3) algorithm on the data for this object
		
		int n = box.length;
		int [][]auxBox = new int[n][n];//auxiliary box
		
		//initialize auxBox first row O(n)
		for (int a = 0; a < n; a++)
			auxBox[a][0] = box[a][0];
		
		//the othercells get set to the sum of the all the cells up to that point in the row
		//O(n^2)
		for (int a = 0; a < n; a++)
			for (int b=1; b < n; b++)
				auxBox[a][b] = auxBox[a][b-1] + box[a][b];
		
		//finally, find the MCSS for every cell in the auxBox and determine if it's greater
		//than the max
		//**Note this is O(n^2*n) = O(n^3)
		int max = MinValueInCell;//initiate to least possible value
		for (int i = 0; i < n; i++)
			for (int j = i; j < n; j++){
				int currentMcss = boxMcss(auxBox, i, j, n);
				if (currentMcss > max)
					max = currentMcss;
			}
		
		return max;
		//**Note that O(n) + O(n^2) + O(n^3) = O(n^3)
	}
	
	public static int boxMcss(int [][]box, int i, int j, int n){
		//performs the mcss algorithm on a box using rows i and j
		//**Note this is O(n)
		int max = 0;
		
		if (i > 0){
			//if not in the first row:
			max = (box[0][j] - box[0][i-1]);
			int sum = 0;
			for(int x = 0; x < n; x++){
				//fnid sum at this point and see if greater than max
				sum += (box[x][j] - box[x][i-1]);
				if (sum > max)
					max = sum;
				if (sum < 0)
					sum = 0;//too small, start over
			}
		}
		else{
			//special case for first row:
			max = box[0][j];
			int sum = 0;
			for (int x = 0; x < n; x++){
				//find sum at this point and see if greater than max
				sum += box[x][j];
				if (sum > max)
					max = sum;
				if (sum < 0)
					sum = 0;//too small, start over
			}
		}
		return max;//this is the maximum common subsequence
	}
	
	public static void main(String []args){
		//main method to call MaxSum on correct file
		
		MaxSum maxObj = new MaxSum("sum.in");
		//System.out.println(maxObj.toString());//for the sake of debugging
		maxObj.timeExecution();
	}
	
}
