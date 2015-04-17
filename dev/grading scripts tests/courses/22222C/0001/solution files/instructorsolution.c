#include <stdio.h>
int main(void)
{
	for (int i = 0; i < 50; i++) 
		printf("%d\n", i % 2 ? i : 4 * i);
}