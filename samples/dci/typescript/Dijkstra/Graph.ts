import HashMap = require('../../typescript/Dijkstra/HashMap');
export = Graph;

function Graph(edges) {
  this.nodes = new HashMap();

  for (var i = 0; i < edges.length; i++) {
	  var edge = edges[i],
		from = edge[0],
		to = edge[1],
		dist = edge[2];

	  forceMap(this.nodes, to);
	  var cur = forceMap(this.nodes, from);
	  cur.put(to, dist);
  }
}

function forceMap(nodes, node) {
	var map = nodes.get(node);
	if (map === undefined) {
	  map = new HashMap();
	  nodes.put(node, map);
	}
	return map;
}