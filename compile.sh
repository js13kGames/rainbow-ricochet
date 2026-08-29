#!/bin/sh
mkdir -p dist
cd src
rollup g.js --format cjs --file ../dist/bundle.js

cd ..

#mkdir -p temp

#cp -av src/t.png temp

#cd temp
#oxipng -o max --strip all t.png --out oxipng.png -v --zc 12 -a

#cp -av oxipng.png ../dist/t.png
#rm t.png oxipng.png
#cd ..
#rmdir temp

cp src/t-tinified.png dist/t.png

cd dist
#terser bundle.js -o i.js --compress --mangle --mangle-props reserved=["g","img","flush","bkg","cls","col","init","generate","createWave"] --timings --toplevel --module
terser bundle.js -o g.js --compress --mangle --mangle-props --timings --toplevel --module
rm bundle.js

# Let roadroller run until stopped. I usually leave it running for an hour and then record the output parameters to save time next time
#roadroller -OO -D g.js -o ./o.js

# Do 100 iterations
#roadroller -O2 -D g.js -o ./o.js

# Use the parameters from a -OO session
roadroller -D -Zab32 -Zdy0 -Zlr2501 -Zmc3 -Zmd161 -Zpr16 -S0,1,2,3,5,6,10,13,19,57,197,354ﬁ g.js -o ./o.js



echo "<meta charset="UTF-8"><style>" > index-template.html
cat ../src/i.css >> index-template.html
echo "</style>" >> index-template.html
echo "<canvas id=\"u\"></canvas>" >> index-template.html
echo "<canvas id=\"c\"></canvas>" >> index-template.html
echo "<script>" >> index-template.html
cat ../src/l1.js >> index-template.html
echo "</script>" >> index-template.html
echo "<script>" >> index-template.html
cat ../src/l2.js >> index-template.html
echo "</script>" >> index-template.html
echo "<script charset=\"utf8\">" >> index-template.html
cat o.js >> index-template.html
echo "</script><div id="s">Press any key to start</div>" >> index-template.html

cat index-template.html | tr -d '\n' > index.html


rm g.js o.js index-template.html

echo "Previous version:"
ls -la ../dist.zip

rm ../dist.zip

zip -9 -r ../dist.zip *

cd ..
echo "ect:"

advzip -z -4 ./dist.zip
./ect-0.9.5 -strip -9 -zip ./dist.zip
ls -la ./dist.zip
