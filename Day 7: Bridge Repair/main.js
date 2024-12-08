const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' })).split("\n").map(v=>v.match(/(\d+): (.+)/));

const recursiveOp = (numarr, concat) => {
    const num1 = numarr.pop();
    if(numarr.length === 1) return num1;
    const num2 = recursiveOp(numarr, concat);
    if(typeof num2 == "number") return [num2+num1, num2*num1, ...(concat?[Number(""+num2+num1)]:[])];
    return [...num2.map(v => v+num1), ...num2.map(v => v*num1), ...(concat?num2.map(v => Number(""+v+num1)):[])];
}

const checker = (data, concat) => data.map(v => recursiveOp(v[2].split(" ").map(Number), concat).includes(Number(v[1]))?Number(v[1]):0).reduce((a,b)=>a+b);

const part1 = checker;
const part2 = checker;
console.log('PART1', part1(data));
console.log('PART2', part2(data, true));