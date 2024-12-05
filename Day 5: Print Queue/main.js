const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }));

/**
 * 
 * @param {String} data 
 * @returns 
 */
const parse = (data) => {
    const ruleorder = Array.from(data.matchAll(/\d+\|\d+/g), v => v[0].split('|'));
    const rules = {};
    ruleorder.forEach(v => !rules[v[0]] ? rules[v[0]] = [v[1]] : rules[v[0]].push(v[1]))
    return [[Object.keys(rules), rules], Array.from(data.matchAll(/(\d+,)+\d+/g), v => v[0].split(','))]
}

/**
 * 
 * @param {[[Array<Numbers>, Object], Array<Array<Numbers>>]} data 
 */
const checkOrder = (data) => {
    const results = [];
    data[1].forEach(list => {
        const ordered = [];
        list.forEach((v, i) => (data[0][0].includes(v)) ? ordered.push(list.slice(0, i).some(x => data[0][1][v].includes(x))) : null)
        if(ordered.some(x=>x)) results.push(0);
        else results.push(Number(list.slice(list.length/2)[0]))
    })
    return results
}

const totalSwaps = {checks: 0, swaps: 0};

const sortAlg = (orderObj, b, a) => {
    const swap = orderObj[0].includes(a) && orderObj[1][a].includes(b);
    totalSwaps.checks++;
    if(swap)totalSwaps.swaps++;
    return swap?0:-1;
}

const sortLists = (data) => {
    const pdata = parse(data)
    const unsorted = checkOrder(pdata).map((v, i) => v===0?i:null).filter(v => v!==null)
    const results = [];
    for (const listid of unsorted) results.push(pdata[1][listid].sort((a, b) => sortAlg(pdata[0], a, b)).map(Number).slice(pdata[1][listid].length/2)[0])
    return results;
}

const part1 = (data) => checkOrder(parse(data)).reduce((p, v) => p+v);
const part2 = (data) => sortLists(data).reduce((p, v) => p+v);

console.log('PART1', part1(data));
console.log('PART2', part2(data));
console.log('PART2 STATS', totalSwaps);