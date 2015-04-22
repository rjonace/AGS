#create autograder executable
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2
VTA_PATH=$3

echo Create Autograder thinks vta is at $VTA_PATH

cd "$CURRENT_PATH/$ASS_ID/autograder_files"
javac -classpath $VTA_PATH *.java
bash ../../../../createAGJar.sh Autograder.jar $VTA_PATH