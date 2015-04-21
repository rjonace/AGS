/* COP 3502, Fall 2013
 * Facebook Hacker Cup Extra Credit - Basketball Game
 * Rodney Jonace */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

struct player {char name[22]; int percentage; int height; int minutes;};
struct queue_node {struct player data; struct queue_node *next;};
struct queue {struct queue_node *front; struct queue_node *back;};

void sortPlayers(struct player player_list[], int num_players);
int compare(struct player player1, struct player player2);
void enqueue(struct queue *bench, struct player benchwarmer);
void dequeue(struct queue *bench);
void sortNames(struct player player_list[], int num_players);

int main(void)
{
	int cases;
	scanf("%d", &cases);

	for (int i = 0; i < cases; i++) {
		int N, M, P;
		scanf("%d %d %d", &N, &M, &P);

		/* read in draft roster */
		struct player *draftlist = calloc(N, sizeof(struct player));
		for (int j = 0; j < N; j++) 
			scanf("%s %d %d", draftlist[j].name, &draftlist[j].percentage, &draftlist[j].height);
		sortPlayers(draftlist, N);

		/* enqueue both benches */
		struct queue bench1, bench2;
		bench1.front =  NULL;
		bench1.back = NULL;
		bench2.front = NULL;
		bench2.back = NULL;
		for (int j = 0; j < N; j++) {
			if (j % 2 == 0) enqueue(&bench1, draftlist[j]);
			else enqueue(&bench2, draftlist[j]);
		}
		free(draftlist);

		/* fill in starting lineups */
		struct player *starters1 = malloc(P * sizeof(struct player));
		struct player *starters2 = malloc(P * sizeof(struct player));
		for (int j = 0; j < P; j++) {
			starters1[j] = bench1.front->data;
			dequeue(&bench1);
			starters2[j] = bench2.front->data;
			dequeue(&bench2);
		}

		/* only run algorithm if there are actually people on the bench */
		if (bench1.front != NULL || bench2.front != NULL)
			for (int game_clock = 1; game_clock <= M; game_clock++) {
				/* increment the playing time of all players currently in the game */
				for (int j = 0; j < P; j++) {
					starters1[j].minutes++;
					starters2[j].minutes++;
				}

				/* send the player from team 1 with the most playing time to the bench in exchange 
				 * for the player next in line on the bench */
				if (bench1.front != NULL) {
					sortPlayers(starters1, P);
					enqueue(&bench1, starters1[P-1]);
					starters1[P-1] = bench1.front->data;
					dequeue(&bench1);
				}

				/* send the player from team 2 with the most playing time to the bench in exchange 
				 * for the player next in line on the bench */
				if (bench2.front != NULL) {
					sortPlayers(starters2, P);
					enqueue(&bench2, starters2[P-1]);
					starters2[P-1] = bench2.front->data;
					dequeue(&bench2);
				}
			}

		/* alphabetize list of players left on the floor */
		struct player *answer = malloc(2 * P * sizeof(struct player));
		for (int j = 0; j < P; j++) {
			answer[j] = starters1[j];
			answer[j+P] = starters2[j];
		}
		sortNames(answer, 2 * P);

		/* print current answer */
		printf("Case #%d:", i + 1);
		for (int j = 0; j < 2 * P; j++)
			printf(" %s", answer[j].name);
		printf("\n");

		/* free memory for next case */
		while (bench1.front != NULL) dequeue(&bench1);
		while (bench2.front != NULL) dequeue(&bench2);
		free(starters1);
		free(starters2);
		free(answer);
	}
}

/* sorts player_list based on who would be next to enter game */
void sortPlayers(struct player player_list[], int num_players)
{
	for(int i = 0; i < num_players; i++)
		for(int j = 0; j < num_players - 1; j++)
			if(compare(player_list[j], player_list[j+1]) > 0) {
				struct player temp = player_list[j+1];
				player_list[j+1] = player_list[j];
				player_list[j] = temp;
			}
}

/* compares player1 and player2 based on who would be next to enter game;
 * returns -1 if it should be player1, 1 if it should be player2, and 0 if it is a tie */
int compare(struct player player1, struct player player2)
{
	if (player1.minutes < player2.minutes) return -1;
	if (player1.minutes > player2.minutes) return 1;

	if (player1.percentage > player2.percentage) return -1;
	if (player1.percentage < player2.percentage) return 1;

	if (player1.height > player2.height) return -1;
	if (player1.height < player2.height) return 1;

	return 0;
}


/* adds benchwarmer to a new node at the back of bench queue */
void enqueue(struct queue *bench, struct player benchwarmer)
{
    struct queue_node *current_node = malloc(sizeof(struct queue_node));
    current_node->data = benchwarmer;
    current_node->next = NULL;

    /* if queue was empty, then front and back both point to newly created node */
    if (bench->front == NULL) {
        bench->front = current_node;
        bench->back = current_node;
    }
    else {
        bench->back->next = current_node;
        bench->back = bench->back->next;
    }
}

/* removes the front node from bench queue */
void dequeue(struct queue *bench)
{
    if (bench->front != NULL) {
        struct queue_node *previous_front = bench->front;
        bench->front = bench->front->next;
        free(previous_front);

        /* if maze queue is now empty, then make sure back points to NULL also */
        if (bench->front == NULL) bench->back = NULL;
    }
}

/* alphabetically sorts members of player_list */
void sortNames(struct player player_list[], int num_players)
{
	for(int i = 0; i < num_players; i++)
		for(int j = 0; j < num_players - 1; j++)
			if(strcmp(player_list[j].name, player_list[j+1].name) > 0) {
				struct player temp = player_list[j+1];
				player_list[j+1] = player_list[j];
				player_list[j] = temp;
			}
}