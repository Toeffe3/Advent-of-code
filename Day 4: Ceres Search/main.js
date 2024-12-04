const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }));

/**
 * 
 * @param {String} text 
 * @returns 
 */
const prepare = (text) => [text.indexOf('\n'), text.split('\n').join('')];

/**
 * @param {String} text 
 * @returns {Number}
 */
const locate = (len, text, letter='X', part2) => Array.from(text.matchAll(new RegExp(letter,'g')))
    .map(v=>v.index<len||(part2&&(v.index%len==0||v.index%len==len-1))?[null,[]]:[v.index, [
        ...text.slice(v.index-len-1,v.index-len+2),
        ...text.slice(v.index-1,v.index+2),
        ...text.slice(v.index+len-1,v.index+len+2)
    ]]);

const dirToPos = (dir, indexPos, len) => {
    switch(dir) {
        case 0: return indexPos-len-1;
        case 1: return indexPos-len;
        case 2: return indexPos-len+1;
        case 3: return indexPos-1;
        case 4: return indexPos; // Not possible
        case 5: return indexPos+1;
        case 6: return indexPos+len-1;
        case 7: return indexPos+len;
        case 8: return indexPos+len+1;
    }
}

const crosswordSearcher = (raw) => {
    const [linelength, text] = prepare(raw);

    const Xes = locate(linelength, text);
    let count = 0;

    for (const i in Xes) {
        Xes[i][1].map((v, i) => v==='M'?i:null).filter(v => v!==null).forEach(v => {
            // After locationg X look at the surounding letters and locate an M, then calculate the string index for the line from X though M to the next 2 letters - then check if all match
            locX = Xes[i][0];
            locM = dirToPos(v, locX, linelength);
            locA = dirToPos(v, locM, linelength);
            locS = dirToPos(v, locA, linelength);
            if([locX, locM, locA, locS].map(v => text.charAt(v)).join('') == "XMAS") count++;
        })
    }

    return count;
}

const crossMasSearcher = (raw) => locate(...prepare(raw),'A',true).map(a=>a[1].filter((_,i)=>(i+1)%2).join('')).map(m=>m=="MMASS"||m=="MSAMS"||m=="SMASM"||m=="SSAMM").reduce((c,v)=>c+v);

const part1 = (data) => crosswordSearcher(data);
const part2 = (data) => crossMasSearcher(data);

console.log('PART1', part1(data));
console.log('PART2', part2(data));
