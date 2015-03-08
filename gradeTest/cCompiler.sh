cd /shared/

for cFile in *.c; do
	classname=${cFile%.*}
	gcc -o /shared/$classname.b /shared/$cFile
done

./AutoGrader.b

