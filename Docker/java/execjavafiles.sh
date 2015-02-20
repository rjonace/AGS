
currentPath=$(pwd)

echo "Copying StudentFiles Contents"
mkdir $currentPath/shared
cp $currentPath/StudentFiles/* $currentPath/shared

echo "Creating container"
#start a timer
docker run -v $currentPath/shared:/shared ags-vm sleep 5
docker ps -lq >> $currentPath/cidfile
#end that timer

echo "Starting container"
docker start $(cat $currentPath/cidfile)

echo "Compiling Source Files"
#start a timer
docker exec -i -t $(cat $currentPath/cidfile) javac /shared/test.java
#end that timer

echo "Running binary file"
#timer inside javaRunner
docker exec $(cat $currentPath/cidfile) javaRunner.sh