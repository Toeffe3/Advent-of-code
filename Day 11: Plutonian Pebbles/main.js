const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' })).split(" ").map(Number)

const applyRules = (num) => {
    if(num == 0) return [1]; // 0
    const len = Math.ceil(Math.log10(num + 1));
    if(len%2) return [num*2024]; // Odd
    const s = 10**(len/2);
    return [Math.floor(num/s), num%s] // Even
}

const recursiveFn = (inp, itr = 75) => {
    if(itr-- < 0) return;
    return inp.flatMap(v => recursiveFn(applyRules(v), itr));
}

const part1 = (data) => {
    let res = 0
    for(let i = 0; i < data.length; i++) {
        const label = `Part1.${i+1}`;
        console.time(label);
        res += recursiveFn([data[i]], 25).length;
        console.timeEnd(label);
    }
    return res
}

const part2 = () => {
    return "Cant be bothered"
}

console.log("Part1", part1(data));
