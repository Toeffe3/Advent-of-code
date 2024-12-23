const data = (require('fs').readFileSync("input.txt", {encoding: "utf-8"})).split(/\n/);

const analyze = (data) => {
	const ret = [];
	const sets = data.map(v => new Set(v.split('-')));
	const t_entries = new Set(data.flatMap(v => v.split('-')).filter(v => v.indexOf("t") === 0))

	for(let x = 0; x < sets.length; x++) {
		for(let y = 0; y < sets.length; y++) {
			if(x === y) continue;
			const match = sets[x].symmetricDifference(sets[y]);
			if(match.size === 2) {
				for(let z = 0; z < sets.length; z++) {
					if(x === z || y === z) continue;
					if(sets[z].difference(match).size === 0) {
						const tmp = sets[x].union(sets[y]);
						if(!ret.some(v => v.difference(tmp).size === 0) &&
						   t_entries.difference(tmp).size < t_entries.size) {
							ret.push(tmp);
						}
					}
				}
			}
		}
	}
	return ret;
}

const part1 = (data) => analyze(data).length; // Warning slow
const part2 = (data) => false;

console.log("PART1", part1(data));
console.log("PART2", part2(data));
