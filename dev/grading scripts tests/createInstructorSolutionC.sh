#create Autograder executable (name of file given)
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

echo `pwd`
cd "$CURRENT_PATH/$ASS_ID/solution files"
gcc $COMPFLAGS -o execi *.c