SUB_PATH=$1

cd $SUB_PATH
cp ../student_files/* .
bash ../../../../createJar.sh execs
cp ../autograder_files/Autograder.jar .
cp ../solution_files/execi .
cp ../input_files/* .
java -jar Autograder.jar