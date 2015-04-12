#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct pointer {
    int name;
    size_t size;
    struct pointer* next;
};

struct pointer* list;
int sum = 0;

void addPointerToList(int name, size_t size){
    void *(*libc_malloc)(size_t) = dlsym(RTLD_NEXT, "malloc");
    struct pointer* temp = libc_malloc(sizeof(struct pointer));
    temp->name = name;
    temp->size = size;
    temp->next = NULL;
    if(list == NULL){
        list = temp;
    } else {
        struct pointer* helper = list;
        while(helper->next != NULL) helper = helper->next;
        helper->next = temp;
    }
}

bool removePointerFromList(int name){
    void (*libc_free)(void*) = dlsym(RTLD_NEXT, "free");
    if(list == NULL){
        return false;
    } else {
        struct pointer* helper = list;
        if( helper->name == name){
            list = helper->next;
            libc_free(helper);
            return true;
        }
        while(helper->next != NULL && helper->next->name != name) helper = helper->next;
        struct pointer* temp = helper->next;
        if(temp == NULL) return false;
        else {
            helper->next = temp->next;
            libc_free(temp);
            return true;
        }
    }
}

bool findAndUpdateInList(int oldName, int newName, size_t size){
    void (*libc_free)(void*) = dlsym(RTLD_NEXT, "free");
    if(list == NULL){
        return false;
    } else {
        struct pointer* helper = list;
        if( helper->name == oldName){
            helper->name = newName;
            int diff = helper->size - size;
            if (diff < 0) sum += -diff;
            helper->size = size;
            return true;
        }
        while(helper->next != NULL && helper->next->name != oldName) helper = helper->next;
        helper = helper->next;
        if(helper == NULL) return false;
        else {
            helper->name = newName;
            int diff = helper->size - size;
            if (diff < 0) sum += -diff;
            helper->size = size;
            return true;
        }
    }
}

void printAllInList()
{
    if(list == NULL){
        printf("No nodes in list\n");
    } else {
        printf("-----------\n");
        struct pointer* helper = list;
        do
        {
            printf("%u | %u \n",helper->name, helper->size);
            helper = helper->next;
        } while(helper != NULL);
        printf("-----------\n");
    }
}


int main()
{
    int* ptr = malloc(sizeof(int)*10);
    free(malloc(10));
    printAllInList();


    int* cptr = calloc(20,sizeof(int));
    printAllInList();
    int* rptr = realloc(cptr, 30*sizeof(int));
    printAllInList();
    int* rptr2 = realloc(rptr, 20*sizeof(int));
    printAllInList();

    free(ptr);

    printf("Sum = %d\n", sum);
    if(list == NULL) printf("No memory leaks\n");
    else {
        printf("Memory leak detected\n");
        printAllInList();
    }
    return 0;
}

void* realloc(void* p, size_t sz)
{
    void *(*libc_realloc)(void*,size_t) = dlsym(RTLD_NEXT, "realloc");
    void *ptr = libc_realloc(p,sz);
    findAndUpdateInList(p,ptr,sz);
    return ptr;
}

void* calloc(size_t n, size_t sz)
{
    void *(*libc_calloc)(size_t,size_t) = dlsym(RTLD_NEXT, "calloc");
    void *p = libc_calloc(n,sz);
    sum += (sz*n);
    addPointerToList(p,(sz*n));
    return p;
}

void* malloc(size_t sz)
{
    void *(*libc_malloc)(size_t) = dlsym(RTLD_NEXT, "malloc");
    void *p = libc_malloc(sz);
    sum += sz;
    addPointerToList(p,sz);
    return p;
}

void free(void *p)
{
    void (*libc_free)(void*) = dlsym(RTLD_NEXT, "free");
    removePointerFromList(p);
    libc_free(p);
}
