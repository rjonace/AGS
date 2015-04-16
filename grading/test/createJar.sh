#version 2 of autograder (non-skeleton)
#create Instructor solution executable (execi)

JAR_NAME=$1
#the only thing in current directory is instructor solution, student helper files
#compiles all .java
javac *.java

#creates jar file 
for classfile in *.class; do
    classname=${classfile%.*}
    echo $classname
    #Execute fgrep with -q option to not display anything on stdout when the match is found
    COND=`javap -public $classname | fgrep 'public static void main(java.lang.String[])'`
    #echo !!!$COND!!!!!
    if [ -n "$COND" ]; then
        jar cfe $JAR_NAME $classname $classfile
    fi
done


