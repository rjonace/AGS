cd /shared/

compileString=""

for cFile in *.c; do
	classname=${cFile%.*}
	compileString=$compileString/shared/$cFile' '
done

gcc -o /shared/AutoGrader $compileString

./AutoGrader

