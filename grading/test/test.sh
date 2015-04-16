#version 2 of autograder (non-skeleton)

#create Autograder executable (name of file given)
#store executables in assignment specific directory

ASS_ID=$1
CURRENT_PATH=$2

echo "Creating Assignment Folder"
mkdir $CURRENT_PATH/$ASS_ID

