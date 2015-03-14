echo "Killing all containers' processes"
docker ps -aq | while read line; do docker kill $line; done;

echo "Stoping all containers"
docker ps -aq | while read line; do docker stop $line; done;

echo "Removing containers"
docker ps -aq | while read line; do docker rm $line; done;