#create Autograder executable (name of file given)
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

cd "$CURRENT_PATH/$ASS_ID/solution_files"
javac $COMPFLAGS *.java
bash ../../../../createJar.sh Execi.jar