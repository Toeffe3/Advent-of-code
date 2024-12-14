const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }))
    .split("\n\n").map(v => {
        const obj = {};
        v.split("\n").map(w => {
            const r = w.match(/(\w+ ?\w?): X.(.+?), Y.(.+)/);
            obj[r[1]] = {X: Number(r[2]), Y: Number(r[3])}
        });
        return obj
    });

const equation2unkown2 = (a1, a2, a3, b1, b2, b3) => {
    const DET = a1*b2 - b1*a2;
    return[(a3*b2 - b1*b3)/DET, (a1*b3 - a3*a2)/DET]
}

const tokensRequired = (data, error=0) => {
    return data.map(v => {
        const [a, b] = equation2unkown2(
            v["Button A"].X, v["Button A"].Y, v["Prize"].X+error,
            v["Button B"].X, v["Button B"].Y, v["Prize"].Y+error);
        if(a == Math.floor(a) && b == Math.floor(b)) return a*3 + b*1 // Only hole number solutions
        return null
    }).filter(Number).reduce((a,b) => a+b);
}

const part1 = tokensRequired;
const part2 = tokensRequired;

console.log("PART1", part1(data));
console.log("PART2", part2(data, 10000000000000));

