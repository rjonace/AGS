echo "Removing Container ID File"
rm cidfile

echo "Copying StudentFiles Contents"
cp ~/docker/StudentFiles/* ~/docker/shared

echo "Creating container"
docker run -v ~/docker/shared:/shared ags-vm sh -v c_exec /shared/a.out /shared/file.c /shared/output
docker ps -lq >> cidfile

echo "Writing Differences"
rm diff
docker diff $(cat cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> diff



