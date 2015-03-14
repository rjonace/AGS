
currentPath=$(pwd)

echo "Removing Container ID File"
rm $currentPath/cidfile

echo "Copying StudentFiles Contents"
mkdir $currentPath/shared
cp $currentPath/StudentFiles/* $currentPath/shared

echo "Creating container"
docker run -v $currentPath/shared:/shared ags-vm sleep 5
docker ps -lq >> $currentPath/cidfile

echo "Starting container"
docker start $(cat $currentPath/cidfile)

echo "Compiling Source Files"
docker exec -i -t $(cat $currentPath/cidfile) gcc -o /shared/a.out /shared/test.c

echo "Running binary file"
docker exec $(cat $currentPath/cidfile) ./shared/a.out >> $currentPath/output.txt

echo "Writing Differences"
docker diff $(cat $currentPath/cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> $currentPath/diff

echo "Moving Files to Completed"
mkdir $currentPath/completed
mv $currentPath/diff $currentPath/completed
mv $currentPath/shared/a.out $currentPath/completed
mv $currentPath/output.txt $currentPath/completed
rm -R $currentPath/shared
