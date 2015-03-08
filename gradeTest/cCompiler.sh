cd /shared/

for cFile in *.c; do
	classname=${cFile%.*}
	compileString+=/shared/$cFile' '
done

gcc -o /shared/AutoGrader $compileString

./AutoGrader

