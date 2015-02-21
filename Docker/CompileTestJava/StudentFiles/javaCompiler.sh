cd /shared/



for javaFile in *.java; do

    javac ${javaFile}

done
echo "Compiled"
for classfile in *.class; do
    classname=${classfile%.*}
    echo $classname
    #if javap -public $classname | fgrep -q 'public static void main(java.lang.String[])'; then
     #   command=`java $classname`
#	echo $command
 #   fi
done
