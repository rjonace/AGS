// Arup Guha
// 10/18/2013
// Solution to COP 3502 Program #3: Maze

#include <stdio.h>
#include <stdlib.h>

#define EMPTY -1
#define NOTFOUND -1
#define MAXSIZE 301
#define BORDERCHAR '~'
#define ILLEGALCHAR 'X'

typedef struct point {
    int x;
    int y;
} pointT;

// Stores one node of the linked list.
typedef struct node {
    pointT* pt;
    struct node* next;
} nodeT;

// Stores our queue.
typedef struct queue {
    nodeT* front;
    nodeT* back;
} queueT;

// Queue functions.
void init(queueT* qPtr);
int enqueue(queueT* qPtr, int x, int y);
pointT* dequeue(queueT* qPtr);
int empty(queueT* qPtr);

// Functions to solve problem.
pointT* findS(char grid[][MAXSIZE], int rows, int cols);
int bfs(char grid[][MAXSIZE], int rows, int cols, pointT* sLoc);

int main() {


    int numCases, loop;
    
    scanf("%d", &numCases);

    for (loop=0; loop<numCases; loop++) {

        int i, j, rows, cols;
        scanf("%d%d", &rows, &cols);
        char grid[MAXSIZE][MAXSIZE];

        // Read in grid.
        for (i=0; i<rows; i++)
            scanf("%s", grid[i]);

        // Get our start point and run our breadth first search.
        pointT* sLoc = findS(grid, rows, cols);

        // Put in a double check for the data here, then output result.
        if (sLoc != NULL)
            printf("%d\n", bfs(grid, rows, cols, sLoc));
    }

    return 0;
}

pointT* findS(char grid[][MAXSIZE], int rows, int cols) {

    // Look in each square for the 'S'...return when you find it.
    int i,j;
    for (i=0; i<rows; i++)
        for (j=0; j<cols; j++)
            if (grid[i][j] == 'S') {
                pointT* retval = malloc(sizeof(pointT));
                retval->x = i;
                retval->y = j;
                return retval;
            }

    // Never Found
    return NULL;
}

int bfs(char grid[][MAXSIZE], int rows, int cols, pointT* sLoc) {

    // Store all distances here - initialize to not found.
    int i, j, dist[MAXSIZE][MAXSIZE];
    for (i=0; i<rows; i++)
        for (j=0; j<cols; j++)
            dist[i][j] = NOTFOUND;

    // Set up queue.
    queueT myq;
    init(&myq);
    int curx = sLoc->x;
    int cury = sLoc->y;
    enqueue(&myq, curx, cury);
    free(sLoc);

    // Put in first distance.
    dist[curx][cury] = 0;

    // Start bfs.
    while (!empty(&myq)) {

        // Get next item - free memory for point once we store its contents elsewhere.
        pointT* nextPos = dequeue(&myq);
        curx = nextPos->x;
        cury = nextPos->y;
        free(nextPos);
        int curdist = dist[curx][cury];

        // We got out, yeah!!!
        if (grid[curx][cury] == BORDERCHAR) {

            // Memory management...
            while (!empty(&myq)) dequeue(&myq);

            // Here is our answer.
            return curdist;
        }

        // Go up.
        if (curx > 0 && grid[curx-1][cury] != ILLEGALCHAR && dist[curx-1][cury] == NOTFOUND) {
            dist[curx-1][cury] = curdist+1;
            enqueue(&myq, curx-1, cury);
        }

        // Go down.
        if (curx < rows-1 && grid[curx+1][cury] != ILLEGALCHAR && dist[curx+1][cury] == NOTFOUND) {
            dist[curx+1][cury] = curdist+1;
            enqueue(&myq, curx+1, cury);
        }

        // Go left.
        if (cury > 0 && grid[curx][cury-1] != ILLEGALCHAR && dist[curx][cury-1] == NOTFOUND) {
            dist[curx][cury-1] = curdist+1;
            enqueue(&myq, curx, cury-1);
        }

        // Go down.
        if (cury < cols-1 && grid[curx][cury+1] != ILLEGALCHAR && dist[curx][cury+1] == NOTFOUND) {
            dist[curx][cury+1] = curdist+1;
            enqueue(&myq, curx, cury+1);
        }

    }

    // If we get here, we never got out :(
    return NOTFOUND;

}

// Pre-condition: qPtr points to a valid struct queue.
// Post-condition: The struct that qPtr points to will be set up to represent an
//                 empty queue.
void init(queueT* qPtr) {

     // Just set both pointers to NULL!
     qPtr->front = NULL;
     qPtr->back = NULL;
}

// Pre-condition: qPtr points to a valid struct queue, (x,y) to be enqueued as pt.
// Post-condition: If the operation is successful, 1 will be returned, otherwise
//                 no change will be made to the queue and 0 will be returned.
int enqueue(queueT* qPtr, int myx, int myy) {

    // Create pt.
    pointT* newPt = malloc(sizeof(pointT));
    newPt->x = myx;
    newPt->y = myy;

    nodeT* temp;

    // Allocate space for a new node to add into the queue.
    temp = malloc(sizeof(nodeT));

    // This case checks to make sure our space got allocated.
    if (temp != NULL) {

        // Set up our node to enqueue into the back of the queue.
        temp->pt = newPt;
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
pointT* dequeue(queueT* qPtr) {

    nodeT* tmp;

    // Check the empty case.
    if (qPtr->front == NULL)
        return NULL;

    // Set up a temporary pointer to use to free the memory for this node.
    tmp = qPtr->front;

    // Make front point to the next node in the queue.
    qPtr->front = qPtr->front->next;

    // If deleting this node makes the queue empty, we have to change the back
    // pointer also!
    if (qPtr->front == NULL)
        qPtr->back = NULL;

    // Store what we need to return.
    pointT* retval = tmp->pt;

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
