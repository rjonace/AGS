// Arup Guha
// 6/1/2010
// Part of Solution for Summer 2010 Computer Science II Program #2

public class PrintJob implements Comparable<PrintJob> {
	
	final public static int SET_UP_TIME = 2;

	// Information for a job.	
	private int timeIn;
	private String fileName;
	private int priority;
	private int pages;
	
	// Regular constructor.
	public PrintJob(int in, String file, int prior, int nump) {
		timeIn = in;
		fileName = file;
		priority = prior;
		pages = nump;
	}
	
	// Determines which job gets priority.
	public int compareTo(PrintJob other) {
		
		// First look at priority.
		if (this.priority < other.priority)
			return -1;
		else if (this.priority > other.priority)
			return 1;
			
		// If they are the same, break the tie based on when the job came 
		// into the queue.
		return this.timeIn - other.timeIn;
	}
	
	// How much time this file takes to print.
	public int timeToPrint() {
		return pages + SET_UP_TIME;
	}
	
	// Regular accessors.
	public String getName() {
		return fileName;
	}
	
	public int getTimeIn() {
		return timeIn;
	}
	
	// Used for debugging.
	public String toString() {
		return "Time "+timeIn + " " + fileName+" "+priority+" "+pages;
	}
	
}