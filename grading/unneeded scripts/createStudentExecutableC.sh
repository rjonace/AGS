SUB_PATH=$1

cd $SUB_PATH
cp ../student_files/* .
gcc -std="gnu99" -o execs -lm *.c