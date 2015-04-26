// Arup Guha
// Started on 6/1/2010
// Completed on 6/15/2010

import java.util.*;
import java.io.*;

public class PrintQueue {
	
	public static void main(String[] args) throws Exception {
		
		Scanner fin = new Scanner(new File("printer.txt"));
		
		int numcases = fin.nextInt();
		
		for (int loop = 1; loop <= numcases; loop++) {
			
			// Output header.
			System.out.println("Printer #"+loop+":\n");
			
			// Run this case.
			run(fin);
			System.out.println();
		}
		
		fin.close();
	}
	
	public static void run(Scanner fin) {
		
		Heap queue = new Heap();
		
		int numjobs = fin.nextInt();
		int cntDone = 0, cntRead = 0;
		int curTime = 0;
		boolean needToRead = true;
		PrintJob tmp = null;
		
		// We keep on going until we've enqueued all jobs and
		// the queue is empty.
		while (cntDone < numjobs) {
			
			// Need to read in the next job to enqueue.
			if (needToRead) {
				
				// Read in all the info and create the object.
				int time = fin.nextInt();
				String name = fin.next();
				int priority = fin.nextInt();
				int numPages = fin.nextInt();
				tmp = new PrintJob(time, name, priority, numPages);
				cntRead++;
			}
				
			// No job is in the queue - insert.
			if (tmp != null && queue.empty()) {
				queue.insert(tmp);
				curTime = Math.max(tmp.getTimeIn(), curTime);
				if (cntRead < numjobs)
					needToRead = true;
				else
					needToRead = false;
					
				tmp = null;
			}
			
			// This job should get enqueued before we process any more dequeues.
			else if (tmp != null && tmp.getTimeIn() < curTime) {
				queue.insert(tmp);
				
				if (cntRead < numjobs)
					needToRead = true;
				else
					needToRead = false;
					
				tmp = null;
			}
			
			// Need to dequeue the current job printing.
			else if (!queue.empty()) {
				PrintJob done = (PrintJob)queue.delMin();
				int timeOut = curTime + done.timeToPrint();
				
				System.out.println(done.getName() + " completed printing at time "+timeOut+".");
				curTime = timeOut;
				needToRead = false;
				cntDone++;
			}
			
			// Should never get here, but if it does, then we should get out of this loop!
			else 
				break;
		}
	}
}