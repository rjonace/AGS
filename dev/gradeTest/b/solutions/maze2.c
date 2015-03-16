// Arup Guha
// 10/18/2013
// Solution to COP 3502 Program #3: Maze - uses a queue of ints and a DX, DY array
// to clean up the enqueue step. Not necessary for students to do these things.

#include <stdio.h>
#include <stdlib.h>

// Constants for the grid and search.
const int EMPTY  = -1;
const int NOTFOUND = -1;
const int MAXSIZE = 301;
const char BORDERCHAR = '~';
const char ILLEGALCHAR = 'X';

// Defines the direction of the four possible moves from a spot in the grid.
const int NUMDIR = 4;
const int DX[] = {-1,0,0,1};
const int DY[] = {0,-1,1,0};

// Stores one node of the linked list.
typedef struct node {
    int data;
    struct node* next;
} nodeT;

// Stores our queue.
typedef struct queue {
    nodeT* front;
    nodeT* back;
} queueT;

// Queue functions.
void init(queueT* qPtr);
int enqueue(queueT* qPtr, int val);
int dequeue(queueT* qPtr);
int empty(queueT* qPtr);

// Functions to solve problem.
int findS(char grid[][MAXSIZE], int rows, int cols);
int bfs(char grid[][MAXSIZE], int rows, int cols, int sLoc);

int main() {

    int numCases, loop;
    scanf("%d", &numCases);

    // Go through each case.
    for (loop=0; loop<numCases; loop++) {

        int i, j, rows, cols;
        scanf("%d%d", &rows, &cols);
        char grid[MAXSIZE][MAXSIZE];

        // Read in grid.
        for (i=0; i<rows; i++)
            scanf("%s", grid[i]);

        // Get our start point and run our breadth first search.
        int sLoc = findS(grid, rows, cols);

        // Put in a double check for the data here, then output result.
        if (sLoc != NOTFOUND)
            printf("%d\n", bfs(grid, rows, cols, sLoc));
    }

    return 0;
}

// Returns where the first 'S' is in the grid as a single integer. Returns -1 if not found.
int findS(char grid[][MAXSIZE], int rows, int cols) {

    // Look in each square for the 'S'...return when you find it.
    int i,j;
    for (i=0; i<rows; i++)
        for (j=0; j<cols; j++)
            if (grid[i][j] == 'S')
                return i*cols + j;

    // Never Found
    return NOTFOUND;
}

// Solves the given problem via a breadth first search, starting at sLoc.
int bfs(char grid[][MAXSIZE], int rows, int cols, int sLoc) {

    // Store all distances here - initialize to not found.
    int i, j, dist[MAXSIZE][MAXSIZE];
    for (i=0; i<rows; i++)
        for (j=0; j<cols; j++)
            dist[i][j] = NOTFOUND;

    // Set up queue.
    queueT myq;
    init(&myq);
    enqueue(&myq, sLoc);

    // Put in first distance.
    int curx = sLoc/cols;
    int cury = sLoc%cols;
    dist[curx][cury] = 0;

    // Start bfs.
    while (!empty(&myq)) {

        // Get next item.
        int nextPos = dequeue(&myq);
        curx = nextPos/cols;
        cury = nextPos%cols;
        int curdist = dist[curx][cury];

        // We got out, yeah!!!
        if (grid[curx][cury] == BORDERCHAR) {

            // Memory management...
            while (!empty(&myq)) dequeue(&myq);

            // Here is our answer.
            return curdist;
        }

        int dir;

        // Try enqueing in all directions.
        for (dir=0; dir<NUMDIR; dir++) {

            // This is the next slot.
            int nextX = curx + DX[dir];
            int nextY = cury + DY[dir];

            // Oops, out of bounds!
            if (nextX < 0 || nextX >= rows) continue;
            if (nextY < 0 || nextY >= cols) continue;

            // Try this direction.
            if (grid[nextX][nextY] != ILLEGALCHAR && dist[nextX][nextY] == NOTFOUND) {
                dist[nextX][nextY] = curdist+1;
                enqueue(&myq, nextX*cols+nextY);
            }
        }

    }

    // If we get here, we never got out :(
    return NOTFOUND;

}

/*** Queue Functions are Below - From Sample Programs on Website ***/

// Pre-condition: qPtr points to a valid struct queue.
// Post-condition: The struct that qPtr points to will be set up to represent an
//                 empty queue.
void init(queueT* qPtr) {

     // Just set both pointers to NULL!
     qPtr->front = NULL;
     qPtr->back = NULL;
}

// Pre-condition: qPtr points to a valid struct queue and val is the value to
//                enqueue into the queue pointed to by qPtr.
// Post-condition: If the operation is successful, 1 will be returned, otherwise
//                 no change will be made to the queue and 0 will be returned.
int enqueue(queueT* qPtr, int val) {

    nodeT* temp;

    // Allocate space for a new node to add into the queue.
    temp = malloc(sizeof(nodeT));

    // This case checks to make sure our space got allocated.
    if (temp != NULL) {

        // Set up our node to enqueue into the back of the queue.
        temp->data = val;
        temp->next = NULL;

        // If the queue is NOT empty, we must set the old "last" node to point
        // to this newly created node.
        if (qPtr->back != NULL)
            qPtr->back->next = temp;

        // Now, we must reset the back of the queue to our newly created node.
        qPtr->back = temp;

        // If the queue was previously empty we must ALSO set the front of the
        // queue.
        if (qPtr->front == NULL)
            qPtr->front = temp;

        // Signifies a successful operation.
        return 1;
    }

    // No change to the queue was made because we couldn't find space for our
    // new enqueue.
    else
        return 0;
}

// Pre-condition: qPtr points to a valid struct queue.
// Post-condition: If the queue pointed to by qPtr is non-empty, then the value
//                 at the front of the queue is deleted from the queue and
//                 returned. Otherwise, -1 is returned to signify that the queue
//                 was already empty when the dequeue was attempted.
int dequeue(queueT* qPtr) {

    nodeT* tmp;
    int retval;

    // Check the empty case.
    if (qPtr->front == NULL)
        return EMPTY;

    // Store the front value to return.
    retval = qPtr->front->data;

    // Set up a temporary pointer to use to free the memory for this node.
    tmp = qPtr->front;

    // Make front point to the next node in the queue.
    qPtr->front = qPtr->front->next;

    // If deleting this node makes the queue empty, we have to change the back
    // pointer also!
    if (qPtr->front == NULL)
        qPtr->back = NULL;

    // Free our memory.
    free(tmp);

    // Return the value that just got dequeued.
    return retval;
}

// Pre-condition: qPtr points to a valid struct queue.
// Post-condition: returns true iff the queue pointed to by pPtr is empty.
int empty(queueT* qPtr) {
    return qPtr->front == NULL;
}
