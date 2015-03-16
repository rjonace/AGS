/****************
* Alan Wright
* P3 Solution
* COP-3520
* 10/18/13
****************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//Constants
#define MAX_ROWS 300
#define MAX_COLS 300
#define BORDER '~'
#define BLOCKED 'X'
#define OPEN '-'
#define START 'S'

// Stores a row and col
struct coordinate {
	int row;
	int col;
};

//One entry in our queue
struct node {
	int numMoves;
    struct coordinate* coord;
    struct node* next;
};

// Stores our queue.
struct queue {
    struct node* front;
    struct node* back;
};

//Function prototypes
char** scanMaze(int rows, int cols);
struct coordinate* findStart(char** maze, int rows, int cols);
void printMaze(char** maze, int rows, int cols);
void freeMaze(char** maze, int rows);
void init(struct queue* qPtr);
struct coordinate* dequeue(struct queue* qPtr);
int enqueue(struct queue* qPtr, int row, int col, int numMoves);
int empty(struct queue* qPtr);
void freeQueue(struct queue* qPtr);
void freeList(struct node* currNode);
void freeNode(struct node* tmp);

int main(void) {

	//Get the number of input cases
	int numCases;
	scanf("%d", &numCases);
	
	//Loop through each case
	int i, rows, cols, found = 0, numMoves = 0;
	struct coordinate* startLoc;
	struct coordinate* currLoc;
	struct node* frontNode;
	char** maze;
	struct queue* qPtr;
	for(i=0; i < numCases; i++) {
		
		//Scan in maze
		scanf("%d %d", &rows, &cols);
		maze = scanMaze(rows, cols);
		
		//Find the start location
		startLoc = findStart(maze, rows, cols);
		
		//Create our queue
		qPtr = (struct queue*)malloc(sizeof(struct queue));
		init(qPtr);
		
		//Enqueue the initial start position
		enqueue(qPtr, startLoc->row, startLoc->col, 0);
		
		//Begin our algorithm for getting out of the maze
		found = 0;
		numMoves = 0;
		while(!empty(qPtr)) {
		
			//Select our current position
			frontNode = qPtr->front;
			currLoc = frontNode->coord;
			numMoves = frontNode->numMoves;
		
			//Check if we are touching the boundary (can escape)
			// This also ensures we can't go out of bounds in our moves below
			if(currLoc->row <= 1 || currLoc->row >= rows - 2 || currLoc->col <= 1 || currLoc->col >= cols - 2) {
				printf("%d\n", numMoves + 1);
				found = 1;
				break;
			}
			
			//If we reach this statement, we'll have to move one space
			numMoves++;
			
			//enqueue up if we can and block the space
			if(maze[currLoc->row - 1][currLoc->col] == OPEN) {
				enqueue(qPtr, currLoc->row - 1, currLoc->col, numMoves);
				maze[currLoc->row - 1][currLoc->col] = BLOCKED;
			}
				
			//enqueue right if we can and block the space
			if(maze[currLoc->row][currLoc->col + 1] == OPEN) {
				enqueue(qPtr, currLoc->row, currLoc->col + 1, numMoves); 
				maze[currLoc->row][currLoc->col + 1] = BLOCKED;
			}
			
			//enqueue down if we can and block the space
			if(maze[currLoc->row + 1][currLoc->col] == OPEN) {
				enqueue(qPtr, currLoc->row + 1, currLoc->col, numMoves);
				maze[currLoc->row + 1][currLoc->col] = BLOCKED;
			}
				
			//enqueue left if we can and block the space
			if(maze[currLoc->row][currLoc->col - 1] == OPEN) {
				enqueue(qPtr, currLoc->row, currLoc->col - 1, numMoves);
				maze[currLoc->row][currLoc->col - 1] = BLOCKED;
			}
			
			//dequeue our current position
			dequeue(qPtr);
		}
		
		//Check if no path was found
		if(!found) {
			printf("-1\n");
		}
		
		//free maze memory
		freeMaze(maze, rows);
		
		//free the linked list memory
		if(!empty(qPtr)) {
			freeQueue(qPtr);
		}
	}
	return 0;
}

//Scans in the maze of size rows x cols
// @returns: 2D char array containing the maze.
char** scanMaze(int rows, int cols) {
	
	//Allocate space for the rows.
	char** maze = (char **)malloc(rows * sizeof(char *));
	
	//Allocate num cols for each row
	int i;
	for(i = 0; i < rows; i++) {
	
		//Scan in each row, remember leave an extra slot for '\0'
		maze[i] = (char *)malloc(cols + 1);
		scanf("%s", maze[i]);
	}
	return maze;
}

//Finds the starting location in the maze of size row x col
// @returns: coordinate struct with (row, col) of S or NULL if no S is found
struct coordinate* findStart(char** maze, int rows, int cols) {
	int i;
	char* result;
	struct coordinate* startLoc;
	
	//Look at each row or string
	for(i=0; i < rows; i++) {
		//Find the start location
		result = strchr(maze[i], START);
		
		//If 'S' was found
		if(result != NULL) {

			//Store our start location
			startLoc = (struct coordinate*)malloc(sizeof(struct coordinate));
			startLoc->row = i;
			startLoc->col = result - maze[i];
			return startLoc;
		}
	}
	
	//No start found
	return NULL;
}

//Prints the maze to the screen. Used for debug.
void printMaze(char** maze, int rows, int cols) {
	int i;
	for(i = 0; i < rows; i++) {
		printf("%s\n", maze[i]);
	}	 	
}

//Frees the memory allocated to a maze
void freeMaze(char** maze, int rows) {
	int j;
	for(j = 0; j < rows; j++) {
		free(maze[j]);
	}
	free(maze);
}

//Initializes the qPtr queue
void init(struct queue* qPtr) {
     qPtr->front = NULL;
     qPtr->back = NULL;
}

//Dequeues the front node in the queue qPtr
// @returns: the coordinates of the dequeued node or NULL if the queue is empty
struct coordinate* dequeue(struct queue* qPtr) {
    
    // Empty case
    if (qPtr->front == NULL)
        return NULL;
    
    // Store the front value to return.
    struct coordinate* retcoord = qPtr->front->coord;
        
    // Temp pointer to free memory
    struct node* tmp = qPtr->front;
    
    // Make front point to the next node in the queue.
    qPtr->front = qPtr->front->next;
    
    // If the queue is empty, the back is null also
    if (qPtr->front == NULL)
        qPtr->back = NULL;
        
    // Free node.
	freeNode(tmp);
    
    // Return the coordinates that just got dequeued.
    return retcoord;
}

//Enqueues a new node into the qPtr queue with it's location (row,col)
// and the number of moves so far (not including the new move)
// @returns: 1 for successful enqueue, 0 for failure.
int enqueue(struct queue* qPtr, int row, int col, int numMoves) {

	//Temporary node for our new node
    struct node* temp = (struct node*)malloc(sizeof(struct node));
    
    // Make sure memory allocation succeeded
    if (temp != NULL) {
             
        // Fill in our temporary node
        temp->coord = (struct coordinate*)malloc(sizeof(struct coordinate));
		temp->coord->row = row;
		temp->coord->col = col;
		temp->numMoves = numMoves;
        temp->next = NULL;
        
        // If the queue is NOT empty, set the old "last" node to point
        // to the new node
        if (qPtr->back != NULL)
            qPtr->back->next = temp;
        
        // Reset the back of the queue to the new node
        qPtr->back = temp;
        
        // If the queue was previously empty the new node is also the front
        if (qPtr->front == NULL)
            qPtr->front = temp;
        
        // Success
        return 1;
    }
    
    // No memory for new enqueue operation
    else
        return 0;   
}

//Determines if a queue is empty
// @returns: 0 for false, nonzero int for true
int empty(struct queue* qPtr) {
    return qPtr->front == NULL;
}

//Frees the queue
void freeQueue(struct queue* qPtr) {
	freeList(qPtr->front);
	qPtr->front = NULL;
	qPtr->back = NULL;
}

//Frees the entire LL recursively.
void freeList(struct node* currNode) {
	if(currNode->next)
		freeList(currNode->next);
	freeNode(currNode);
}

//Frees a specified node
void freeNode(struct node* tmp) {
	free(tmp->coord);
	free(tmp);
}