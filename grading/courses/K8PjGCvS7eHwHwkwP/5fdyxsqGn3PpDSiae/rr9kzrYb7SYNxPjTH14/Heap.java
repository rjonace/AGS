// Arup Guha
// 6/20/05
// Array Implementation of a Heap Class.

// Edited on 5/27/2010 for Summer 2010 Computer Science II Program 2 Solution

public class Heap {

    private Comparable[] elements; /* Key change to allow print jobs */ 
  	private int size; // Stores the actual number of elements in the heap.

  	public final int EMPTY = -1;
  	public final int MAX_SIZE = 1000; /* Key change to allow 1000 print jobs */

  	// Creates an empty Heap, initially with 1000 possible locations.
  	public Heap() {
        elements = new Comparable[MAX_SIZE];
    	size = 0;
  	}

  	// Creates a heap from an array of unordered values. Runs the makeHeap
  	// function.
  	public Heap(Comparable[] values) {

    
        // Allocate twice as much space as necessary for the array.
    	size = values.length;
    	elements = new Comparable[2*(size+1)];

    	// Copy in all the values into the elements array. Note that no value
    	// is stored in index 0 of the elements array.
    	for (int i=0; i<size; i++)
            elements[i+1] = values[i];

    	// Percolate Down each necessary element, in backwards order.
    	for (int i=size/2; i>0; i--)
            percolateDown(i);
    }
    
    // Returns true iff this Heap is empty.
    public boolean empty() {
    	return size == 0;
    }
    
    // Returns the item at the top of the heap.
    public Comparable peekMin() {
    	return elements[1];
    }

    // Insert the element x into the Heap.
    public boolean insert(Comparable x) {

        // No more space to insert any elements.
    	if (size == elements.length-1)
            return false;

    	// Initially place x at the bottom/end of the heap.
    	elements[size+1] = x;

    	// Percolate this element up so it can find its proper location in the
    	// Heap.
    	percolateUp(size+1);

    	// Adjust the size of the Heap and indicate a successful insertion.
    	size++;
    	return true;
    }

    // Returns the minimum item stored in the Heap.
    public Comparable delMin() {

        // No item to return.
    	if (size == 0)
      	    return EMPTY;

    	// Store the minimum value to return.
    	Comparable retval = elements[1];

    	// Place the last element in the first slot.
    	elements[1] = elements[size];

    	// Percolate this element down to its proper location.
    	percolateDown(1);

    	// Adjust the size of the Heap and return the minimum element.
    	size--;
    	return retval;
  }

    // Percolates up the element at index i.
  	private void percolateUp(int i) {

        boolean done = false;

    	// Keep on going if we need to as long as the top of the Heap hasn't
    	// been reached.
    	while (!done && i > 1) {

            // If the current element is smaller than its parent we must continue.
      		if (elements[i].compareTo(elements[i/2]) < 0) {

        	    // Swap element i with its parent.
        		Comparable temp = elements[i/2];
        		elements[i/2] = elements[i];
        		elements[i] = temp;

        		i = i/2; // Adjust i, and see if we need to continue.
      		}

      		// The correct location of the element has been found.
      		else
        	    done = true;
    	}

    }

    // Percolates down the element at index i.
  	private void percolateDown(int i) {

        boolean done = false;

    	// Keep on going as long we need to as long as we haven't reached the
    	// bottom row of the heap.
    	while (!done && i <= size/2) {

      		// Find the minimum valued child of index i.
      		int minindex = findMinChildIndex(i);

      		// See if this child is smaller than the one at index i.
      		if (elements[i].compareTo(elements[minindex]) > 0) {

        	    // Swap these two.
        		Comparable temp = elements[minindex];
        		elements[minindex] = elements[i];
        		elements[i] = temp;

        		i = minindex; // Adjust i and continue.
      		}

      		// We have found the correct location for this element.
      		else
        		done = true;
    	}
    }

    // Finds the index of the minimum child of the element stored at index i.
    // Precondition: i must be the index of a node with a child.
  	private int findMinChildIndex(int i) {

        // If the node has only one child.
    	if (size == 2*i)
      		return 2*i;

    		// Compare the two children and return the appropriate index.
    		if (elements[2*i].compareTo(elements[2*i+1]) < 0)
      		    return 2*i;
    		else
      			return 2*i+1;
    }

    // Print out the values of the heap.
    private void printHeap() {

        for (int i=1; i<=size; i++)
            System.out.print(elements[i]+" ");
        System.out.println();
    }
}
