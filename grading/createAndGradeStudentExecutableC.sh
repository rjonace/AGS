SUB_PATH=$1

cd $SUB_PATH
cp ../student_files/* .
gcc -std="gnu99" -o execs -lm *.c
cp ../autograder_files/Autograder.jar .
cp ../solution_files/execi .
cp ../input_files/* .
java -jar Autograder.jar