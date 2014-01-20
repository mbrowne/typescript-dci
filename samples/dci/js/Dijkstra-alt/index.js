var Graph = require('./Graph');
var Subgraph = require('./Subgraph');

var a = { id: 'a' }, b = { id: 'b' }, c = { id: 'c' }, d = { id: 'd' }, e = { id: 'e' }, f = { id: 'f' }, g = { id: 'g' }, h = { id: 'h' }, i = { id: 'i' };

var edges = [
    [a, b, 2],
    [a, d, 1],
    [b, c, 3],
    [b, e, 2],
    [c, f, 1],
    [d, e, 1],
    [d, g, 2],
    [e, f, 1],
    [f, i, 4],
    [g, h, 1],
    [h, i, 2]
];

var graph = new Graph(edges);
var ctx = new Subgraph(a, graph);

//Run the use case
var path = ctx.findShortestPath();

var proper = [];

var cur = i, prev;
while (prev = path.get(cur)) {
    proper.unshift(prev);
}

proper.unshift(a);

console.log(proper.join(" -> "));

