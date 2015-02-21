cd /shared/



for javaFile in *.java; do

    javac ${javaFile}

done

java AutoGrader

#GRADING=`java AutoGrader`
#echo $GRADING
