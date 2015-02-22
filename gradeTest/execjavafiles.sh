
currentPath=$2

echo "Creating Temporary Folder"
mkdir $currentPath/$1

echo "Copying StudentFiles Contents"
mkdir $currentPath/$1/shared
cp $currentPath/VTA.java $currentPath/$1/shared
cp $currentPath/javaCompiler.sh $currentPath/$1/shared
cp $currentPath/InstructorFiles/* $currentPath/$1/shared
cp $currentPath/SubmissionFiles/* $currentPath/$1/shared

echo "Creating container"
docker run -v $currentPath/$1/shared:/shared ags-vm sh /shared/javaCompiler.sh >> $currentPath/$1/output.txt
docker ps -lq >> $currentPath/cidfile

#echo "Starting container"
#docker start $(cat $currentPath/cidfile)

#echo "Compiling Source Files"
#docker exec $(cat $currentPath/cidfile) sh /shared/javaCompiler.sh >> $currentPath/$1/output.txt


#echo "Running AutoGrader  binary file"
#docker start $(cat $currentPath/cidfile)
#docker exec $(cat $currentPath/cidfile) java AutoGrader >> $currentPath/$1/output.txt

echo "Writing Differences"
docker diff $(cat $currentPath/cidfile) | sed -e '/^C/d' -e 's:^A ::g' >> $currentPath/$1/diff

echo "Writing Log Files"
docker logs $(cat $currentPath/cidfile) >> $currentPath/$1/logs.txt

echo "Moving Files to Completed"
rm $currentPath/cidfile
mkdir $currentPath/results
mv $currentPath/$1/* $currentPath/results
#mv $currentPath/$1/diff $currentPath/$1/results
#mv $currentPath/$1/shared/*.class $currentPath/$1/results
#mv $currentPath/$1/shared/scriptOut $currentPath/$1/results
#mv $currentPath/$1/output.txt $currentPath/$1/results
#mv $currentPath/$1/logs.txt $currentPath/$1/results
#mv $currentPath/$1/results $currentPath
rm -R $currentPath/$1
touch $currentPath/completed
