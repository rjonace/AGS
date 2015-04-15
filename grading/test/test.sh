#version 2 of autograder (non-skeleton)
#create Instructor solution executable (execi)
#create Autograder executable (name of file given)
#store executables in assignment specific directory

AG_NAME=$1

for classfile in *.class; do
    classname=${classfile%.*}
    COND=`javap -public $classname | fgrep 'public static void main(java.lang.String[])'`
    echo $COND
done