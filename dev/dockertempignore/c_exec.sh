

$executable=$1
$file=$2
$output=$3


gcc -o $executable $file

.$file > $output