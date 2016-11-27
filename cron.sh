#/bin/bash

git pull --ff-only

wget -x -nv -w 1 --random-wait -i urls.txt
./xhr.sh

jsb="js-beautify --replace --break-chained-methods --wrap-line-length 180 --end-with-newline --newline-between-rules"
find \( -name "*.js" -or -name "*.html" -or -name "*.css" \) -exec $jsb {} +

git commit -a -m "$(date +"%x %T")" && git push
