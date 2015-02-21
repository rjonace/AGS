cd /shared/



for javaFile in *.java; do

    javac ${javaFile}

done
echo "Compiled"
for classfile in *.class; do
    classname=${classfile%.*}
    echo $classfile
    if javap -public $classname | fgrep -q 'public static void main(java.lang.String[])'; then
        echo $classname
        java $classname
    fi
done