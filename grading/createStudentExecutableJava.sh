SUB_PATH=$1

cd $SUB_PATH
cp ../student_files/* .
bash ../../../../createJar.sh execs
