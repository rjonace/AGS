cd /shared/



for javaFile in *.java; do

    javac ${javaFile}

done
echo "Compiled"
for classfile in *.class; do
    classname=${classfile%.*}
    javap -public $classname
    if javap -public $classname | fgrep -q 'public static void main(java.lang.String[])'; then
        java $classname
    fi
done