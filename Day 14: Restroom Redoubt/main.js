const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }))
    .replaceAll(/p=(-?\d+,-?\d+) v=(-?\d+,-?\d+)/g, "$1,$2").split("\n").map(v => v.split(",").map(Number));

const TALL = 103;
const WIDE = 101;

const move = (data, seconds=1) => {
    while(seconds-->0) {
        for(let robot of data) {
            robot[0] = (robot[0] + robot[2]) % WIDE;
            robot[1] = (robot[1] + robot[3]) % TALL;
            if(robot[0] < 0) robot[0] += WIDE;
            if(robot[1] < 0) robot[1] += TALL;
        }
    }
    return data;
}

const draw = (data) => {
    let d = [];
    for(let y = 0; y < TALL; y++) 
        for(let x = 0; x < WIDE; x++) 
            d.push(data.filter(v => v[0]==x && v[1]==y).length)
    return d;
}

const quadrants = (data) => {
    const q = (new Array(4)).fill(0);
    for(let y = 0; y < TALL; y++)
        for(let x = 0; x < WIDE; x++)
            if(!(y == (TALL-1)/2 || x == (WIDE-1)/2)) q[((y > (TALL-1)/2)*2) + (x > (WIDE-1)/2)] += data.filter(v => v[0]==x && v[1]==y).length;
    return q.reduce((a,b)=>a*b);
}

const part1 = quadrants;
const part2 = (data, match=0) => {
    let iterations = 0;
    do {
        const p = draw(move(data));
        if(p.filter(v => v>1).length === 0) {
            console.log(p.join(""));
            console.log(iterations, p.filter(v => v>1).length);
            match--;
        }
        iterations++;
    } while(match > 0);
    return iterations;
}

console.log("PART1", part1(data.slice())); //.slice() = copy
console.log("PART2", part2(data, 2)) // 2 state with only 1 and 0 is the christmas tree (trial and error) 
