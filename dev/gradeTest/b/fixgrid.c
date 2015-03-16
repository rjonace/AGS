#include <stdio.h>

int pass(char grid[][301], int numR, int numC);

int main() {

    int numCases, numR, numC;

    scanf("%d", &numCases);
    printf("%d\n", numCases);

    int i,j;
    for (i=0; i<numCases; i++) {

        scanf("%d%d", &numR, &numC);
        printf("%d %d\n", numR, numC);

        char grid[300][301];
        for (j=0; j<numR; j++)
            scanf("%s", grid[j]);
        for (j=0; j<numR; j++) {
            grid[j][0] = '~';
            grid[j][numC-1] = '~';
        }
        for (j=0; j<numC; j++) {
            grid[0][j] = '~';
            grid[numR-1][j] = '~';
        }
        for (j=0; j<numR; j++)
            printf("%s\n", grid[j]);
    }


    return 0;
}
