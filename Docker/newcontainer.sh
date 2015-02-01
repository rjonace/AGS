echo "Removing container ID file"
rm cidfile
echo "Creating container"
docker run -v ~/sharedfiles:/shared ags-vm sleep 5
docker ps -lq >> cidfile

echo "Starting container"
docker start $(cat cidfile)

echo "Compiling Source Files"
docker exec $(cat cidfile) gcc -o /shared/a.out /shared/program.c

echo "Running binary file"
docker exec $(cat cidfile) ./shared/a.out

echo "Writing Differences"
rm diff
#docker diff $(cat cidfile) > diff

#echo "Formating Differences"
docker diff $(cat cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> diff

for var in $(cat diff) 
do
	echo $var
	if [ $var != /shared ]
	then
		docker exec $(cat cidfile) mv $var /shared
	fi;
done;



