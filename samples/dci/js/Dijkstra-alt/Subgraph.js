var __dci_internal__ = require('typescript-dci/dci');
var DCI = require('../../DCI');


/**
* Calculate the shortest path between two points using the Dijkstra algorithm.
* Based on the Marvin implementation by Rune Funch
*/
var Subgraph = DCI.Context.extend(function () {
var __context = this;
this.__$Graph = {        distanceBetween: function (node, otherNode) {
            return __context.Graph.nodes.get(node).get(otherNode);
        }
        ,removeNode: function (node) {
            __context.Graph.nodes.remove(node);
        }
        ,updateDistance: function (node, distance) {
            __context.Graph.distances[node] = distance;
        }
};
this.__$Node = {        neighbors: function () {
            return __context.Graph.nodes.get(__context.Node);
        }
        ,distance: function () {
            return __context.Graph.distances.get(__context.Node);
        }
        ,setAsPreviousOf: function (node) {
            __context.Graph.previous.add(node, __context.Node);
        }
        ,distanceTo: function (otherNode) {
            return __context.__$Graph.distanceBetween.call(__context.Graph, __context.Node, otherNode);
        }
        ,neighborWithShortestPath: function () {
            var neighbor, shortestDistance = Infinity;
            __context.Graph.distances.each(function (node, val) {
                if (val < shortestDistance) {
                    shortestDistance = val;
                    neighbor = node;
                }
            });
            return neighbor;
        }
};
    this.bindRoles = function (node, graph) {
        __context.Node = node;
        __context.Graph = graph;
        __context.__$Graph.updateDistance.call(__context.Graph, node, 0);
    };


    this.findShortestPath = function () {
        var neighbors = __context.__$Node.neighbors.call(__context.Node).keys;
        if (neighbors.length == 0)
            return __context.Graph.previous;
        neighbors.forEach(function (neighbor) {
            var alt = __context.__$Node.distance.call(__context.Node) + __context.__$Node.distanceTo.call(__context.Node, neighbor);
            if (alt < __context.Graph.distances.get(neighbor)) {
                __context.__$Graph.updateDistance.call(__context.Graph, neighbor, alt);
                __context.__$Node.setAsPreviousOf.call(__context.Node, neighbor);
            }
        });
        __context.__$Graph.removeNode.call(__context.Graph);
        var nearestNode = __context.__$Node.neighborWithShortestPath.call(__context.Node);

        new Subgraph(nearestNode, __context.Graph).findShortestPath();
        return __context.Graph.previous;
    };
});
module.exports = Subgraph;

