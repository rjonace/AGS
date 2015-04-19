#create autograder executable
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

cd "$CURRENT_PATH/$ASS_ID/autograder_files"
echo $COMPFLAGS
javac $COMPFLAGS *.java
bash ../../../../createJar.sh Autograder.jar