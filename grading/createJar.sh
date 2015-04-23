#create an executable jar file with name set as JAR_NAME

JAR_NAME=$1
COMPFLAGS=$2

#compiles all .java
javac $COMPFLAGS *.java

#creates jar file packaging every class file in the directory
#should only be one java file that has a main because that becomes the entry point of the jar
for classfile in *.class; do
    classname=${classfile%.*}
    COND=`javap -public $classfile | fgrep 'public static void main(java.lang.String[])'`
    if [ -n "$COND" ]; then
        jar cfe $JAR_NAME $classname *.class $classfile
    fi
done


