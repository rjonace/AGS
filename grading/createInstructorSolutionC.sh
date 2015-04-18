#create Autograder executable (name of file given)
#store executables in assignment specific directory

echo whatTheFuck

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

cd "$CURRENT_PATH/$ASS_ID/solution files"
compileString=""
for cFile in *.c; do		
	compileString=$compileString $cFile		
done		

echo $compileString
gcc -lm $COMPFLAGS -std=gnu99 -o execi $compileString")
