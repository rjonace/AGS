echo "Creating Docker Image"
docker build -t 'ags-vm' - < Dockerfile
echo "Docker Images"
docker images