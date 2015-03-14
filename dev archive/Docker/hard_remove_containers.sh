#super hard remove 

boot2docker ssh


#sudo rm -rfi /mnt/sda1/var/lib/docker/aufs/mnt/*

# do this one for each id
sudo rm -rfi /mnt/sda1/var/lib/docker/containers/*

for var in $(sudo ls /mnt/sda1/var/lib/docker/containers/); 
do 
	sudo rm -rfi /mnt/sda1/var/lib/docker/containers/$line; 
done;