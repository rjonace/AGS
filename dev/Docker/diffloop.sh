for dir in $(cat diff)
do
	echo $dir
	if [ $dir = '/\/.*' ]
	then
		echo 'directory'
	fi
done