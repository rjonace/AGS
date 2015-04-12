// Arup Guha
// 10/29/2013
// Solution to Computer Science Program #4: Organ Donation
// Note: This solution was created by editing the solution to program #1.

/*** I am not really happy with this solution. In particular, my delete function is really
     bulky. There must be a easier way to accomplish it, but what I wrote is based on how
     I charted out all of the different cases before I went to code it.
***/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SIZE 20
#define BLOODTYPESIZE 4
#define NOTFOUND -1

typedef struct {
    int month;
    int day;
    int year;
} dateT;

typedef struct {
    int hour;
    int minute;
} timeT;

typedef struct {
    char name[SIZE];
    char organname[SIZE];
    char bloodtype[BLOODTYPESIZE];
    dateT dateAdded;
    timeT timeAdded;
} organT;

// To be faithful to the specification, I store a compare string in the node.
struct node {
    organT* organ;
    char compStr[SIZE+BLOODTYPESIZE];
    struct node* left;
    struct node* right;
};

typedef struct node nodeT;

// Used for reading in the information.
nodeT* readInput(int n);
nodeT* readRecord();
void setDate(organT* ptrOrgan, char* date);
void setTime(organT* ptrOrgan, char* myTime);

// Used to do comparisons of the binary tree.
int datecmp(const dateT* d1, const dateT* d2);
int timecmp(const timeT* t1, const timeT* t2);
int namecmp(const nodeT* o1, const nodeT* o2);
int organcmp(const nodeT* o1, const nodeT* o2);

// Used to find the best match for a particular organ/blood type combination.
nodeT* findBest(nodeT* organs, char* donorOrgan, char* donorBlood);
void findBestRec(nodeT* organs, nodeT* item, nodeT** curBest);

// Binary Tree Functions.
nodeT* insert(nodeT* root, nodeT* newnode);
nodeT* removeNode(nodeT* root, nodeT* item);
void copy(nodeT* LHS, nodeT* RHS);
nodeT* getMax(nodeT* root);
int hasTwoChildren(nodeT* root);
void freeTree(nodeT* root);

int main() {

    // Read in the wait list.
    int n;
    scanf("%d", &n);
    nodeT* organs = readInput(n);

    int numOrgans, i;
    scanf("%d", &numOrgans);

    // Process each received organ.
    for (i=0; i<numOrgans; i++) {

        // Read in the organ received and find the recipient.
        char organ[SIZE], bloodtype[BLOODTYPESIZE];
        scanf("%s%s", organ, bloodtype);
        nodeT* delnode = findBest(organs, organ, bloodtype);

        // Output the result.
        if (delnode == NULL)
            printf("No match found\n");
        else {
            printf("%s %s\n", delnode->organ->name, delnode->organ->organname);
            organs = removeNode(organs, delnode);
        }
    }

    freeTree(organs);

    return 0;
}

// Reads in n organ records and returns a pointer to the binary tree that stores them.
nodeT* readInput(int n) {

    int i;
    nodeT* tree = NULL;

    // Just read each one and insert!
    for (i=0; i<n; i++) {
        nodeT* item = readRecord();
        tree = insert(tree, item);
    }

    return tree;
}

// Reads in a single record, allocates a node to store it, and returns a pointer
// to that node.
nodeT* readRecord() {

    // Allocate space.
    nodeT* item = malloc(sizeof(nodeT));
    item->organ = malloc(sizeof(organT));

    // Read everything in.
    char dateStr[SIZE], timeStr[SIZE];
    scanf("%s%s%s%s%s", item->organ->name, item->organ->organname, item->organ->bloodtype, dateStr, timeStr);
    setDate(item->organ, dateStr);
    setTime(item->organ, timeStr);

    // Necessary to speed up comparisons if we stick to the specification.
    strcpy(item->compStr, item->organ->organname);
    strcat(item->compStr, item->organ->bloodtype);

    // Set pointers and return.
    item->left = NULL;
    item->right = NULL;
    return item;
}

// Inserts the node pointed to by newnode into the binary tree pointed to by root, and
// returns a pointer to the new root of the resulting tree.
nodeT* insert(nodeT* root, nodeT* newnode) {

    // Empty Tree Case.
    if (root == NULL)
        return newnode;

    // Strictly less - go left.
    if (organcmp(newnode, root) < 0)
        root->left = insert(root->left, newnode);

    // Otherwise, go right (note: no two organs will be equal...)
    else
        root->right = insert(root->right, newnode);

    // This is our root of the new tree.
    return root;
}


nodeT* removeNode(nodeT* root, nodeT* item) {

    // Item must not be in tree...
    if (root == NULL) return NULL;

    // Special base case. Deleting real root.
    if (root == item) {

        // Single node.
        if (root->left == NULL && root->right == NULL) {
            free(root);
            return NULL;
        }

        // Go right, after delete.
        else if (root->left == NULL) {
            nodeT* retval = root->right;
            free(root);
            return retval;
        }

        // Go left after delete.
        else if (root->right == NULL) {
            nodeT* retval = root->left;
            free(root);
            return retval;
        }

        // Two child case - don't physically delete this node. Copy info from the
        // max on the left and then delete that node.
        else {
            nodeT* maxLeft = getMax(root->left);
            copy(root, maxLeft);
            root->left = removeNode(root->left, maxLeft);
            return root;
        }
    }

    // Item to delete is the left child of root.
    if (root->left != NULL && item == root->left) {

        // Pawn the work off, since it's the 2 child case.
        if (hasTwoChildren(root->left)) {
            root->left = removeNode(root->left, item);
        }

        // Patch around this node and free it, both of these cases.
        else if (root->left->left != NULL) {
            root->left = root->left->left;
            free(item);
        }
        else if (root->left->right != NULL) {
            root->left = root->left->right;
            free(item);
        }

        // Nothing left past item, so set the pointer to NULL and free.
        else {
            root->left = NULL;
            free(item);
        }
        return root;
    }

    // All the same work for the right side of the tree.
    if (root->right != NULL && item == root->right) {

        // Pass of the work.
        if (hasTwoChildren(root->right)) {
            root->right = removeNode(root->right, item);
        }

        // Patch the tree and free in these two cases.
        else if (root->right->left != NULL) {
            root->right = root->right->left;
            free(item);
        }
        else if (root->right->right != NULL) {
            root->right = root->right->right;
            free(item);
        }

        // item to delete is leaf node.
        else {
            root->right = NULL;
            free(item);
        }
        return root;
    }

    // Recursive delete.
    if (organcmp(item, root) < 0)
        root->left = removeNode(root->left, item);
    else
        root->right = removeNode(root->right, item);

    return root;
}

// Returns true iff root has subtrees on both sides.
int hasTwoChildren(nodeT* root) {
    return root->left != NULL && root->right != NULL;
}

// Returns the largest node in the tree pointed to by root.
nodeT* getMax(nodeT* root) {

    // Should never trigger.
    if (root == NULL) return NULL;

    // Base case.
    if (root->right == NULL) return root;

    // Can go right, so do it.
    return getMax(root->right);
}

// Properly free the memory for the tree rooted at root.
void freeTree(nodeT* root) {
    if (root != NULL) {
        freeTree(root->left);
        freeTree(root->right);
        free(root->organ);
        free(root);
    }
}

// Copies the relevant data from the node pointed to by RHS to the node pointed to
// by LHS. Note that once we are done copying, we can free LHS's organ data, which
// won't get used after this gets called.
void copy(nodeT* LHS, nodeT* RHS) {
    organT* temp = LHS->organ;
    LHS->organ = RHS->organ;
    strcpy(LHS->compStr, RHS->compStr);
    free(temp);
}

// Given the date stored in a string, stores it appropriately in the organ pointed to by ptrOrgan
void setDate(organT* ptrOrgan, char* date) {
    char* tmpPtr = strtok(date, "/");
    ptrOrgan->dateAdded.month = atoi(tmpPtr);
    tmpPtr = strtok(NULL, "/");
    ptrOrgan->dateAdded.day = atoi(tmpPtr);
    tmpPtr = strtok(NULL, "/");
    ptrOrgan->dateAdded.year = atoi(tmpPtr);
}

// Given the time stored in a string, stores it appropriately in the organ pointed to by ptrOrgan
void setTime(organT* ptrOrgan, char* myTime) {
    char* tmpPtr = strtok(myTime, ":");
    ptrOrgan->timeAdded.hour = atoi(tmpPtr);
    tmpPtr = strtok(NULL, ":");
    ptrOrgan->timeAdded.minute = atoi(tmpPtr);
}

// Returns a negative integer if the date pointed to by d1 comes before the one pointed to
// by d2, 0 if they are equal and 1 if the date pointed to by d1 comes after the one pointed to by d2.
int datecmp(const dateT* d1, const dateT* d2) {
    if (d1->year != d2->year)
        return d1->year - d2->year;
    if (d1->month != d2->month)
        return d1->month - d2->month;
    return d1->day - d2->day;
}

// Returns a negative integer if the time pointed to by t1 comes before the one pointed to
// by t2, 0 if they are equal and 1 if the time pointed to by t1 comes after the one pointed to by t2.
int timecmp(const timeT* t1, const timeT* t2) {
    if (t1->hour != t2->hour)
        return t1->hour - t2->hour;
    return t1->minute - t2->minute;
}

// Returns a negative integer if the organ pointed to by o1 has a name/bloodtype concatenation that
// comes before that of o2, 0 if they are the same, and a positive integer otherwise. We utilize the
// fact that no organ is a substring of another organ here and that ll blood types have capital letters
// which come before all lowercase letters.
int namecmp(const nodeT* o1, const nodeT* o2) {
    return strcmp(o1->compStr, o2->compStr);
}

// Returns a negative integer if the organ pointed to by o1 comes before o2 according to
// the assignment specification, 0 if equal, and a positive integer otherwise.
int organcmp(const nodeT* o1, const nodeT* o2) {

    // We first break ties by looking at the name.
    int alphacmp = namecmp(o1, o2);
    if (alphacmp != 0)
        return alphacmp;

    // Then, the date.
    int firstcmp = datecmp(&(o1->organ->dateAdded), &(o2->organ->dateAdded));
    if (firstcmp != 0)
        return firstcmp;

    // All ties must be broken by time.
    return timecmp(&(o1->organ->timeAdded), &(o2->organ->timeAdded));
}

// Given the full list of organs, its size, and a donor organ and blood type, this
// function returns the index where the best matching donor is found.
nodeT* findBest(nodeT* organs, char* donorOrgan, char* donorBlood) {

    // Will store answer.
    nodeT* retval = NULL;

    // Create a temp node for this search.
    nodeT* tmp = malloc(sizeof(nodeT));
    tmp->organ = malloc(sizeof(organT));
    strcpy(tmp->organ->organname, donorOrgan);
    strcpy(tmp->organ->bloodtype, donorBlood);
    strcpy(tmp->compStr, tmp->organ->organname);
    strcat(tmp->compStr, tmp->organ->bloodtype);

    // Recursively search for the best answer here.
    nodeT* ans = NULL;
    findBestRec(organs, tmp, &ans);
    free(tmp);

    return ans;
}

// Finds the best match for item in the tree rooted with organs, and
// stores a pointer to it in *curBest.
void findBestRec(nodeT* organs, nodeT* item, nodeT** curBest) {

    // Base case: No where else to look.
    if (organs == NULL)
        return;

    // Do the name comparison.
    int cmp = namecmp(item, organs);

    // Update our match with the root node, if necessary.
    if (cmp == 0)
        if (*curBest == NULL || organcmp(organs, *curBest) < 0)
            *curBest = organs;

    // Go left on both ties and strictly left cases. This is because we want the
    // earliest match. If this node is a match, it will ONLY be beat by something
    // to the left, which comes earlier.
    if (cmp <= 0)
        findBestRec(organs->left, item, curBest);

    // Must go right, otherwise.
    else
        findBestRec(organs->right, item, curBest);
}
