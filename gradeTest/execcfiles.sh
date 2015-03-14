
currentPath=$2

echo "Creating Temporary Folder"
mkdir $currentPath/$1

echo "Copying StudentFiles Contents"
mkdir $currentPath/$1/shared
cp $currentPath/../vta/VTA.c $currentPath/$1/shared
cp $currentPath/../vta/VTA.h $currentPath/$1/shared
cp $currentPath/cCompiler.sh $currentPath/$1/shared
cp $currentPath/InstructorFiles/* $currentPath/$1/shared
cp $currentPath/SubmissionFiles/* $currentPath/$1/shared

echo "Creating container"
docker run -v $currentPath/$1/shared:/shared ags-vm sh /shared/cCompiler.sh >> $currentPath/$1/output.txt
docker ps -lq >> $currentPath/cidfile

echo "Writing Differences"
docker diff $(cat $currentPath/cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> $currentPath/$1/diff

echo "Writing Log Files"
docker logs $(cat $currentPath/cidfile) >> $currentPath/$1/logs.txt

echo "Moving Files to Completed"
rm $currentPath/cidfile
mkdir $currentPath/results
mv $currentPath/$1/* $currentPath/results
rm -R $currentPath/$1
echo completed >>  $currentPath/completed
