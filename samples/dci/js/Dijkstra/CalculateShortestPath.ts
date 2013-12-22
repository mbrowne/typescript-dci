import DCI = require('../../DCI');
import HashMap = require('../../typescript/Dijkstra/HashMap');

export = CalculateShortestPath;

/**
 * Calculate the shortest path between two points using the Dijkstra algorithm.
 * This javascript version was based on an earlier (non-TypeScript)  implementation by Egon Elbre.
 */
var CalculateShortestPath = DCI.Context.extend(function() {
	
	this.bindRoles = function(initial, destination, graph) {
		Initial <- initial;
		Graph <- graph;
		Tentative <- new HashMap();
		Unvisited <- new HashMap();
		Path <- new HashMap(); // best path (to --> from)
		
		this.destination = destination;
	}
	
	//Run the use case
	this.run = function() {	
		Graph.nodes.each(function(node) {
			Unvisited.add(node);
			Tentative.add(node, Infinity);
		});
		Tentative.add(Initial, 0);
		
		Current = Initial;
		Current.markVisited();

		while (!Unvisited.isEmpty()) {
		  Current.relaxDistances();
		  Current.markVisited();

		  if (!Unvisited.has(this.destination)) break;

		  Current = Unvisited.findNearest();
		  if (Current === undefined) break;
		}		
		return Path.to(this.destination);
	}
	
	role Initial {}
	
	role Neighbor {
		visited() {
			return !Unvisited.has(this);
		}
	}
	
	role Current {
		markVisited() {
			Unvisited.remove(this);
		}
		
		getNeighbors() {
			return Graph.neighbors(this);
		}
		
		relaxDistances() {
			this.getNeighbors().each(function(node) {
				Neighbor <- node;
				if (Neighbor.visited()) return;

				var alternate = Tentative.get(Current) + Current.distanceTo(Neighbor);
				if (alternate < Tentative.get(Neighbor)) {
				  Tentative.add(Neighbor, alternate);
				  Path.add(Neighbor, Current);
				}
			});
		}
		
		distanceTo(other) {
			return Graph.distance(this, other);
		}
	}
	
	role Graph {
		distance(from, to) {
			if(from === to) return 0;
			return this.nodes.get(from).get(to) || Infinity;
		}
	  
		neighbors(node) {
			return this.nodes.get(node);
		}
	}
	
	role Tentative {}
	
	role Unvisited {
		findNearest() {
			var nearest = undefined,
				distance = Infinity;
			this.each(function(node) {
				var dist = Tentative.get(node);
				if(dist < distance) {
					nearest = node;
					distance = dist;
				}
			})
			return nearest;
		}
	}
	
	role Path {
		to(to) {
			var path = [to],
				cur = to;
			while (cur != Initial) {
				cur = this.get(cur);
				path.unshift(cur);
				if (cur === undefined) {
					return undefined;
				}
			}
			return path;
		}
	}
});