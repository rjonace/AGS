
currentPath=$2

echo "Creating Temporary Folder"
mkdir $currentPath/$1

echo "Copying StudentFiles Contents"
mkdir $currentPath/$1/shared
cp $currentPath/StudentFiles/* $currentPath/$1/shared

echo "Creating container"
docker run -v $currentPath/$1/shared:/shared ags-vm sleep 5
docker ps -lq >> $currentPath/cidfile

echo "Starting container"
docker start $(cat $currentPath/cidfile)

echo "Compiling Source Files"
docker exec $(cat $currentPath/cidfile) sh /shared/javaCompiler.sh >> $currentPath/$1/output.txt

#echo "Running binary file"
#docker exec $(cat $currentPath/cidfile) sh /shared/javaRunner.sh

echo "Writing Differences"
docker diff $(cat $currentPath/cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> $currentPath/$1/diff

echo "Writing Log Files"
docker logs $(cat $currentPath/cidfile) >> $currentPath/$1/logs.txt

echo "Moving Files to Completed"
rm $currentPath/cidfile
mkdir $currentPath/$1/results
mv $currentPath/$1/diff $currentPath/$1/results
mv $currentPath/$1/shared/*.class $currentPath/$1/results
#mv $currentPath/$1/shared/output.txt $currentPath/$1/results
mv $currentPath/$1/output.txt $currentPath/$1/results
mv $currentPath/$1/logs.txt $currentPath/$1/results
mv $currentPath/$1/results $currentPath
rm -R $currentPath/$1
touch $currentPath/completed
