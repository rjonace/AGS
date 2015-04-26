/** Rodney Jonace
 *  COP 3503 Computer Science II
 *  Section 0013 - Wednesday 2:30
 *  Spring 2014
 *  Assignment 6 - Dynamic Programming Hopscotch */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Scanner;
import java.util.TreeSet;

public class HopscotchStudent
{

	public static void main(final String[] args) throws FileNotFoundException
	{
		/* open the input file and scan how many cases there are to process */
		final Scanner input = new Scanner(System.in);
		int cases = input.nextInt();
		input.close();
		for (int k = 1; k <= cases; k++)
		{
			System.out.println("Game #" + k + ": " + k);
		}
	
	}


}