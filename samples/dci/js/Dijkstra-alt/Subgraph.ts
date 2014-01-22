import DCI = require('../../DCI');
export = Subgraph;

/**
 * Calculate the shortest path between two points using the Dijkstra algorithm.
 * Based on the Marvin implementation by Rune Funch
 */
var Subgraph = DCI.Context.extend(function() {

	this.bindRoles = function(node, graph) {
		Node <- node;
		Graph <- graph;
		Graph.updateDistance(node, 0);
	}
	
	role Graph {
		distanceBetween(node, otherNode) {
			return self.nodes.get(node).get(otherNode);
		}
		
		removeNode(node) {
			self.nodes.remove(node);
		}
		
		updateDistance(node, distance) {
			self.distances[node] = distance;
		}
	}
	
	role Node {
		neighbors() {
			return Graph.nodes.get(self);
		}
		
		distance() {
			return Graph.distances.get(self);
		}
		
		setAsPreviousOf(node) {
			Graph.previous.put(node, self);
		}
		
		distanceTo(otherNode) {
			return Graph.distanceBetween(self, otherNode);
		}
		
		neighborWithShortestPath() {
			var neighbor,
				shortestDistance = Infinity;
				
			Graph.distances.each(function(node, val) {
				if (val < shortestDistance) {
					shortestDistance = val;
					neighbor = node;
				}
			});
			return neighbor;
		}
	}
	
	this.findShortestPath = function() {
		var neighbors = Node.neighbors().keys;
		if (neighbors.length == 0) return Graph.previous;
		
		neighbors.forEach(function(neighbor) {
			var alt = Node.distance() + Node.distanceTo(neighbor);
			if (alt < Graph.distances.get(neighbor)) {
				Graph.updateDistance(neighbor, alt);
				Node.setAsPreviousOf(neighbor);
			}
		});
		
		Graph.removeNode();
		var nearestNode = Node.neighborWithShortestPath();
		new Subgraph(nearestNode, Graph).findShortestPath();
		return Graph.previous;
	}
	
});