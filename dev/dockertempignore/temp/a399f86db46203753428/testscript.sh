#!/bin/bash

compiler=$1
file=$2
output=$3
addtionalArg=$4

exec  1> /usercode/logfile.txt
exec  2> /usercode/errors
#3>&1 4>&2 >

START=$(date +%s.%2N)

echo compiler $compiler file $file output $output args $additionalArg

echo $compiler /usercode/$file -< /usercode/inputFile #| tee /usercode/output.txt


echo $?

echo finished