#!/bin/sh
mkdir -p dist
cd src
rollup g.js --format cjs --file ../dist/bundle.js

cd ..

cp src/t-tinified.png dist/t.png

cd dist

closure-compiler --compilation_level ADVANCED --env BROWSER --externs ../closure-externs.js --js bundle.js --js_output_file gc.js
rm bundle.js
terser gc.js -o g.js --compress passes=3 --mangle --mangle-props --timings --toplevel --module

# Let roadroller run until stopped. I usually leave it running for an hour and then record the output parameters to save time next time
#roadroller -OO -D g.js -o ./roadroller.js

# Do 100 iterations
#roadroller -O2 -D g.js -o ./roadroller.js

# Use the parameters from a -OO session
roadroller -D -Zab17 -Zlr2737 -Zmc3 -Zmd130 -Zpr16 -S0,1,2,3,5,7,13,17,42,201,309,338 g.js -o ./roadroller.js

cat ../src/l1.js ../src/l2.js ../src/l3.js ../src/l4.js roadroller.js > o.js


echo "<meta charset="UTF-8"><style>" > index-template.html
cat ../src/i.css >> index-template.html
echo "</style>" >> index-template.html
echo "<canvas id=\"u\" width="1280" height="720"></canvas>" >> index-template.html
echo "<canvas id=\"c\" width="1280" height="720"></canvas>" >> index-template.html
echo "<script charset=\"utf8\">" >> index-template.html
cat o.js >> index-template.html
echo "</script>" >> index-template.html

cat index-template.html | tr -d '\n' > index.html


rm gc.js g.js o.js roadroller.js index-template.html

echo "Previous version:"
ls -la ../dist.zip

rm ../dist.zip

zip -9 -r ../dist.zip *

cd ..
echo "ect:"

advzip -z -4 ./dist.zip
./ect-0.9.5 -strip -9 -zip ./dist.zip
ls -la ./dist.zip
