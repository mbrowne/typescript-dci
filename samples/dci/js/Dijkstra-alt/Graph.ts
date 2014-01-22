import HashMap = require('../../typescript/Dijkstra/HashMap');
export = Graph;

function Graph(edges) {
  this.nodes = new HashMap();
  this.distances = new HashMap();
  this.previous = new HashMap();

  for (var i = 0; i < edges.length; i++) {
	  var edge = edges[i],
		from = edge[0],
		to = edge[1],
		dist = edge[2];
	  
	  var pairs = this.nodes.get(from);
	  if (pairs == null) {
	      pairs = new HashMap();
	      pairs.put(to, dist);
	      this.nodes.put(from, pairs);
	  }
	  else {
	      pairs.put(to, dist);
	  }
	  
 	  this.distances.put(from, Infinity);
  }
}