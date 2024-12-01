const fs = require('node:fs');

/**
 * @param {string} text 
 * @returns {[Array<number>,Array<Number>]}
 */
const parse = (text) => {
    const out = [[],[]];
    text.split(/\n/).forEach(line => {
        let tmp = line.split(/   /);
        out[0].push(Number(tmp[0]));
        out[1].push(Number(tmp[1]));
    });
    out[0].sort();
    out[1].sort();
    return out;
}

/**
 * @param {[Array<number>, Array<number>]} arr
 * @returns {Array<number>}
 */
const compare = (arr) => arr[0].map((_, i) => Math.abs(arr[0][i] - arr[1][i]));

/**
 * @param {[Array<number>, Array<number>]} arr
 * @returns {{[number]: number}}
 */
const similarity = (arr) => {
    const count = []
    arr[0].forEach(v => {
            const tmp = arr[1].filter((n) => n==v).length;
            if(tmp !== 0) count.push([v, tmp]);
        }
    )
    return count;
}

/**
 * Get the solution for part 1
 * @param {text} inputfile 
 */
function part1(inputfile) {
    try {
        const data = fs.readFileSync(inputfile, { encoding: 'utf8' });
        return compare(parse(data)).reduce((p, v) => p+v, 0);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Get the solution for part 2
 * @param {text} inputfile 
 */
function part2(inputfile) {
    try {
        const data = fs.readFileSync(inputfile, { encoding: 'utf8' });
        return similarity(parse(data)).reduce((p, v) => p+(v[0]*v[1]), 0);
    } catch (err) {
        console.log(err);
    }
}

console.log('PART1', part1('input.txt'))
console.log('PART2', part2('input.txt'))