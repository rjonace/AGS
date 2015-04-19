#create autograder executable
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

cd "$CURRENT_PATH/$ASS_ID/autograder_files"
echo before
javac $COMPFLAGS *.java
echo after
bash ../../../../createJar.sh Autograder.jar