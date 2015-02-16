
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
docker exec -i -t $(cat $currentPath/cidfile) sh /shared/javaCompiler.sh

echo "Running binary file"
docker exec $(cat $currentPath/cidfile) sh /shared/javaRunner.sh >> $currentPath/output.txt

echo "Writing Differences"
docker diff $(cat $currentPath/cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> $currentPath/diff

echo "Writing Log Files"
docker logs $(cat $currentPath/cidfile) >> $currentPath/logs.txt

echo "Moving Files to Completed"
rm $currentPath/cidfile
mkdir $currentPath/completed
mv $currentPath/diff $currentPath/completed
mv $currentPath/shared/*.class $currentPath/completed
mv $currentPath/output.txt $currentPath/completed
mv $currentPath/logs.txt $currentPath/completed
rm -R $currentPath/shared