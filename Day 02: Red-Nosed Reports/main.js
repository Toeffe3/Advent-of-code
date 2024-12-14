const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' })).split(/\n/);

Array.prototype.consecutive = function(rule) {
    return [].concat(this).every(function(v, i, a) {
        if(i===0) return true;
        return rule(v, a[i-1]);
    })
}

const isSafe = (arr) => (arr.consecutive((x, y) => x > y) || arr.consecutive((x, y) => x < y)) && arr.consecutive((x, y) => [1,2,3].includes(Math.abs(x - y)));

const format = (data) => {
    const out = [];
    for(let report of data) out.push(report.split(' ').map(Number));
    return out
}

const createPermutations = (arr) => {
    const all = [];
    for(let i in arr) {
        let perm = arr.slice(); // copy
        perm.splice(i, 1);
        all.push(perm);
    }
    return all;
}

const check = (data, dampener) => {
    const array = format(data);
    const cheked = (!dampener) ? array.map(isSafe) : array.map(createPermutations).map(p => p.some(isSafe));
    return cheked.filter(Boolean).length;
}

const part1 = () => check(data);
const part2 = () => check(data, true);

console.log('PART1', part1());
console.log('PART2', part2());