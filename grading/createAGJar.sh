#create an executable jar file with name set as JAR_NAME

JAR_NAME=$1
VTA_PATH=$2

#compiles all .java
javac *.java

#creates jar file 
#should only be one java file that has a main because that becomes the entry point of the jar
for classfile in *.class; do
    classname=${classfile%.*}
    COND=`javap -classpath .:$VTA_PATH -public $classfile | fgrep 'public static void main(java.lang.String[])'`
    if [ -n "$COND" ]; then
    	echo $classfile
        jar cfe $JAR_NAME $classname *.class -C $VTA_PATH vta -C $CUSTOM_PATH *
    fi
done


