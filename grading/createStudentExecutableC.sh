SUB_PATH=$1
cp $SUB_PATH/../student_files/*.* $SUB_PATH/
gcc -std="gnu99" -o execs -lm *.c