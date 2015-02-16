
currentPath=$(pwd)

echo "Copying StudentFiles Contents"
mkdir $currentPath/shared
cp $currentPath/StudentFiles/* $currentPath/shared

echo "Creating container"
docker run -v $currentPath/shared:/shared ags-vm sleep 5
docker ps -lq >> $currentPath/cidfile

echo "Starting container"
docker start $(cat $currentPath/cidfile)

echo "Compiling Source Files"
docker exec -i -t $(cat $currentPath/cidfile) javac /shared/test.java

echo "Running binary file"
docker exec $(cat $currentPath/cidfile) javaRunner.sh