#include <stdio.h>
int main(void)
{
	for (int i = 0; i < 50; i++) 
		printf("%lf hey!\n%d\n", 6.27 * i, i % 2 ? i : 4 * i);
}