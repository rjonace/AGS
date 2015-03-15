// Arup Guha
// 3/8/2011
// Example the both reads from a file and writes to a file.
#include <stdio.h>

int main() {

    FILE *ifp, *ofp;
    int numgirls, index, numboxes, stars;
    char name[20];

    // Open both files.
    ifp = fopen("cookie.txt","r");
    ofp = fopen("cookiegraph.txt", "w");

    // Read in and print out the number of girls.
    fscanf(ifp, "%d", &numgirls);
    fprintf(ofp, "%d\n", numgirls);

    // Loop through each girl in the input file.
    for (index=0; index<numgirls; index++) {

        // Read in the name & number of cookies.
        fscanf(ifp, "%s", &name);
        fprintf(ofp, "%s\t", name);
        fscanf(ifp, "%d", &numboxes);

        // Print out one star for each cookie!
        for (stars=0; stars<numboxes; stars++)
            fprintf(ofp,"*");

        // Advance to the next line.
        fprintf(ofp, "\n");
    }

    // Close both files.
    fclose(ifp);
    fclose(ofp);
    return 0;
}