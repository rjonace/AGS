CUR_PATH=$1
echo trying runAutograder
cd $CUR_PATH
#docker run -v $CUR_PATH:/shared/ ags-vm java -jar Autograder.jar
java -jar Autograder.jar