$path = $(pwd)

echo $path

echo "Removing Container ID File"
rm $path/cidfile

echo "Copying StudentFiles Contents"
cp $path/StudentFiles/* $path/shared

echo "Creating container"
docker run -v $path/shared:/shared ags-vm sleep 5
docker ps -lq >> $path/cidfile

echo "Starting container"
docker start $(cat $path/cidfile)

echo "Compiling Source Files"
docker exec -i -t $(cat $path/cidfile) gcc -o /shared/a.out /shared/test.c

echo "Running binary file"
docker exec $(cat $path/cidfile) ./shared/a.out >> $path/output.txt

echo "Writing Differences"
rm $path/diff
docker diff $(cat $path/cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> $path/diff



