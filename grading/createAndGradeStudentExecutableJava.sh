set -e

SUB_PATH=$1
COMPFLAGS=$2

cd $SUB_PATH

mkdir -p ../student_files/
touch ../student_files/dummy
cp ../student_files/* .
bash ../../../../createJar.sh execs $COMPFLAGS

touch compilationworked
pwd >> compilationworked

cp ../autograder_files/Autograder.jar .
cp ../solution_files/execi .

mkdir -p ../input_files/
touch ../input_files/dummy
cp ../input_files/* .

#java -jar Autograder.jar

docker run -v $SUB_PATH:/shared/ ags-vm cd shared && java -jar Autograder.jar
docker diff $(docker ps -lq)