cd /shared/



for javaFile in *.java; do

    javac ${javaFile}

done

for classfile in *.class; do
    classname=${classfile%.*}

    if javap -public $classname | fgrep -q 'public static void main(java.lang.String[])'; then
        java $classname >> output.txt
    fi
done