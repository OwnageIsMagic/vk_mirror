
# ff="vk.com/js/lang0_0.js"
# if [ -f $ff ];
# then
#     gunzip -cd <$ff | iconv -f CP1251 -t UTF8 >$ff.bak
#     mv $ff.bak $ff
# fi
# find . -type f -printf "gunzip -cd <%P| iconv -f CP1251 -t UTF8 >%P.bak && mv %P.bak %P\n" 

jsb="js-beautify --replace --break-chained-methods --wrap-line-length 180 --end-with-newline --newline-between-rules"
find \( -name "*.js" -or -name "*.html" -or -name "*.css" \) -exec $jsb {} +