#create Autograder executable (name of file given)
#store executables in assignment specific directory

echo whatTheFuck

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

cd "$CURRENT_PATH/$ASS_ID/solution_files"
pwd
echo `pwd`
for cFile in *.c; do
	gcc $cFile -std=gnu99 -o execi #"$COMPFLAGS"
done