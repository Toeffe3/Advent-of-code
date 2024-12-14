const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }));

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

const part1 = () => compare(parse(data)).reduce((p, v) => p+v, 0);
const part2 = () => similarity(parse(data)).reduce((p, v) => p+(v[0]*v[1]), 0);

console.log('PART1', part1());
console.log('PART2', part2());