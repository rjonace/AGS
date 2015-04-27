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

public class Hopscotch
{
	private static TreeSet<Integer> primeTable  = new TreeSet<Integer>();
	private static int solution[] = {0};
	static { primeTable.add(2); }

	public static void main(final String[] args) throws FileNotFoundException
	{
		/* open the input file and scan how many cases there are to process */
		final Scanner input = new Scanner(new File("hopscotch.in"));
		int cases = input.nextInt();
	
		for (int k = 1; k <= cases; k++)
		{
			int n = input.nextInt();
			
			/* only calculate and update entry for score(n) if it is not already solved for in 
			 * lookup table */
			int highestSolved = solution.length - 1;
			if (n > highestSolved) {
				/* expand size of solution table and mark unsolved entries in the lookup table with 
				 * Integer.MAX_VALUE */
				solution = Arrays.copyOf(solution, n + 1);
				Arrays.fill(solution, highestSolved + 1, n + 1, Integer.MAX_VALUE);
				
				/* ensure all primes less than or equal to n are in the prime number table */
				for (int i = primeTable.last() + 1; i <= n; i++) addIfPrime(i);
			}
	
			/* print solution */
			System.out.println("Game #" + k + ": " + score(n));
		}
	
		input.close();
	}

	/** adds n to the prime number lookup table if it is prime; assumes every prime number less
	 *  than n is already in the prime number lookup table */
	private static void addIfPrime(final int n)
	{
		for (int factor = primeTable.first(); 
				factor <= Math.sqrt(n) && primeTable.higher(factor) != null;
				factor = primeTable.higher(factor))
			if (n % factor == 0) return;
	
		for (int factor = primeTable.last() + 1; factor <= Math.sqrt(n); factor++)
			if (n % factor == 0) return;
	
		primeTable.add(n);
	}

	/** returns lowest possible score for n in the game; recursively solves for the answer if n's
	 *  entry is not yet in the solution table and adds the entry to the lookup table */
	private static int score(final int n)
	{
		/* only calculate and update entry for score(n) if it is not already solved for in lookup
		 * table; unsolved entries in the lookup table contain Integer.MAX_VALUE */
		if (solution[n] == Integer.MAX_VALUE)
			solution[n] = minimum(
					1 + score(n - 1),
					n > 10 && primeTable.contains(n) ? 3 + score(n - n % 10) : Integer.MAX_VALUE,
					n % 11 == 0 ? 4 + score(n - sumOfDigits(n)) : Integer.MAX_VALUE,
					n % 7 == 0 ? 2 + score(n - 4) : Integer.MAX_VALUE);
	
		return solution[n];
	}

	/** returns the smallest value amongst the integers passed in choices */
	private static int minimum(final int... choices)
	{
		Arrays.sort(choices);
		return choices[0];
	}

	/** returns the sum of n's digits */
	private static int sumOfDigits(int n)
	{
		int sum = 0;
		while (n != 0) {
			sum += n % 10;
			n /= 10;
		}
	
		return sum;
	}
}