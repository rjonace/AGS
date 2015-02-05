echo "Removing Container ID File"
rm cidfile

echo "Copying StudentFiles Contents"
cp ~/docker/StudentFiles/* ~/docker/shared

echo "Creating container"
docker run -v ~/docker/shared:/shared ags-vm sleep 5
docker ps -lq >> cidfile

echo "Starting container"
docker start $(cat cidfile)

echo "Compiling Source Files"
docker exec -i -t $(cat cidfile) gcc -o /shared/a.out /shared/test.c

echo "Running binary file"
docker exec $(cat cidfile) ./shared/a.out >> StudentFiles/output

echo "Writing Differences"
rm diff
docker diff $(cat cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> diff



