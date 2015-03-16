#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define MAXSIZE 300

void print(char grid[][MAXSIZE], int r, int c);
void mkgrid(char grid[][MAXSIZE], int r, int c);
void mkspec1(char grid[][MAXSIZE], int r, int c);
void mkspec2(char grid[][MAXSIZE], int r, int c);
void mkgridtough(char grid[][MAXSIZE], int r, int c);

int main() {

    srand(time(0));

    char grid[300][300];

    int i, j, loop;
    for (loop=0; loop<19; loop++) {

        int r = 40 + rand()%41;
        int c = 40 + rand()%41;
        printf("%d %d\n", r, c);
        mkgridtough(grid, r, c);
        print(grid,r,c);
    }
/*
    // Make 10 random, in between 40 x 40 and 80 x 80
    int i, j, loop;
    for (loop=0; loop<10; loop++) {

        int r = 40 + rand()%41;
        int c = 40 + rand()%41;
        printf("%d %d\n", r, c);
        mkgrid(grid, r, c);
        print(grid,r,c);
    }

    // Make 2 300 x 300 - 1 random, 1 max case.
    mkgrid(grid, 300, 300);
    printf("300 300\n");
    print(grid, 300, 300);

    printf("300 300\n");
    mkspec1(grid, 300, 300);
    print(grid, 300, 300);

    printf("300 300\n");
    mkspec2(grid, 300, 300);
    print(grid, 300, 300);

    printf("300 300\n");
    mkspec2(grid, 300, 300);
    grid[1][3] = 'X';
    print(grid, 300, 300);
*/
    return 0;
}

void mkgrid(char grid[][MAXSIZE], int r, int c) {

    int i, j, x, y;
    for (i=0; i<r; i++) {
        grid[i][0] = '~';
        grid[i][c-1] = '~';
    }
    for (i=0; i<c; i++) {
        grid[0][i] = '~';
        grid[r-1][i] = '~';
    }

    for (i=1; i<r-1; i++)
        for (j=1; j<c-1; j++)
            grid[i][j] = '-';

    int numX = rand()%(r*c)/7;
    for (i=0; i<numX; i++) {
        x = 1 + rand()%(r-2);
        y = 1 + rand()%(c-2);
        grid[x][y] = 'X';
    }

    x = 1+ rand()%(r-2);
    y = 1 + rand()%(c-2);
    grid[x][y] = 'S';
}

void print(char grid[][MAXSIZE], int r, int c) {

    int i,j;
    for (i=0; i<r; i++) {
        for (j=0; j<c; j++)
            printf("%c", grid[i][j]);
        printf("\n");
    }
}

void mkspec1(char grid[][MAXSIZE], int r, int c) {

    int i, j, x, y;
    for (i=0; i<r; i++) {
        grid[i][0] = '~';
        grid[i][c-1] = '~';
    }
    for (i=0; i<c; i++) {
        grid[0][i] = '~';
        grid[r-1][i] = '~';
    }

    for (i=1; i<r-1; i++) {
        grid[i][1] = 'X';
        grid[i][c-2] = 'X';
    }
    for (i=0; i<c-1; i++) {
        grid[1][i] = 'X';
        grid[r-2][i] = 'X';
    }
    for (i=2; i<r-2; i++)
        for (j=2; j<c-2; j++)
            grid[i][j] = '-';

    grid[r/2][c/2] = 'S';
}


void mkspec2(char grid[][MAXSIZE], int r, int c) {

    int i, j, x, y;
    for (i=0; i<r; i++) {
        grid[i][0] = '~';
        grid[i][c-1] = '~';
    }
    for (i=0; i<c; i++) {
        grid[0][i] = '~';
        grid[r-1][i] = '~';
    }

    for (i=1; i<r-1; i++) {
        grid[i][1] = 'X';
        grid[i][c-2] = 'X';
    }
    for (i=0; i<c-1; i++) {
        grid[1][i] = 'X';
        grid[r-2][i] = 'X';
    }
    for (i=2; i<r-2; i++)
        for (j=2; j<c-2; j++)
            grid[i][j] = '-';

    grid[2][c-3] = 'S';

    for (j=c-4; j>3; j-=4)
        for (i=2; i<r-3; i++)
            grid[i][j] = 'X';

    for (j=c-6; j>1; j-=4)
        for (i=3; i<r-2; i++)
            grid[i][j] = 'X';
    grid[1][3] = '-';
}

void mkgridtough(char grid[][MAXSIZE], int r, int c) {

    int i, j, x, y;
    for (i=0; i<r; i++) {
        grid[i][0] = '~';
        grid[i][c-1] = '~';
    }
    for (i=0; i<c; i++) {
        grid[0][i] = '~';
        grid[r-1][i] = '~';
    }

    for (i=1; i<r-1; i++)
        for (j=1; j<c-1; j++)
            grid[i][j] = '-';

    int numX = rand()%(r*c)/2;
    for (i=0; i<numX; i++) {
        x = 1+ rand()%(r-2);
        y = 1 + rand()%(c-2);
        grid[x][y] = 'X';
    }

    x = 1+ rand()%(r-2);
    y = 1 + rand()%(c-2);
    grid[x][y] = 'S';
}
