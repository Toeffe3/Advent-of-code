const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }));

/**
 * @param {String} text 
 * @returns {Number}
 */
const findMul = (text, dodont) => Array.from((dodont?text.replace(/(don't\(\)).*?(do\(\)|$)/g,''):text).matchAll(/mul\((\d+),(\d+)\)/g)).reduce((p, c) => p + c[1]*c[2], 0);

const part1 = () => findMul(data);
const part2 = () => findMul(data,true);

console.log('PART1', part1());
console.log('PART2', part2());


//One-liner (Full program - give js and regex some love <3)
//console.log(((d=>[d,d.replace(/(don't\(\)).*?(do\(\)|$)/g,'')].map(v=>Array.from(v.matchAll(/mul\((\d+),(\d+)\)/g)).reduce((p,c)=>p+c[1]*c[2],0)))(require('fs').readFileSync('input.txt',{encoding:'utf8'}))))