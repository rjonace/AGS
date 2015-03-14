cd /shared/

compileString=""

for cFile in *.c; do
	classname=${cFile%.*}
	compileString=$compileString/shared/$cFile' '
done

gcc -std=c99 -o /shared/AutoGrader $compileString

./AutoGrader

