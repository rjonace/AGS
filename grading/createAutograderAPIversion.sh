#create autograder executable
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2
COMPFLAGS=$3

cd "$CURRENT_PATH/$ASS_ID/autograder_files
pwd
ls
javac $COMPFLAGS *.java
pwd
ls
bash ../../../../createJar.sh Autograder.jar
pwd
ls