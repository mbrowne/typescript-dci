var __dci_internal__ = require('typescript-dci/dci');
var DCI = require('../../DCI');
var HashMap = require('../../typescript/Dijkstra/HashMap');



/**
* Calculate the shortest path between two points using the Dijkstra algorithm.
* This javascript version was based on an earlier (non-TypeScript)  implementation by Egon Elbre.
*/
var CalculateShortestPath = DCI.Context.extend(function () {
var __context = this;
this.__$Initial = {};
this.__$Neighbor = {        visited: function () {
            return !__context.Unvisited.has(this);
        }
};
this.__$Current = {        markVisited: function () {
            __context.Unvisited.remove(this);
        }
        ,getNeighbors: function () {
            return __context.__$Graph.neighbors.call(__context.Graph, this);
        }
        ,relaxDistances: function () {
            __context.__$Current.getNeighbors.call(__context.Current).each(function (node) {
                __context.Neighbor = node;
                if (__context.__$Neighbor.visited.call(__context.Neighbor))
                    return;
                var alternate = __context.Tentative.get(__context.Current) + __context.__$Current.distanceTo.call(__context.Current, __context.Neighbor);
                if (alternate < __context.Tentative.get(__context.Neighbor)) {
                    __context.Tentative.add(__context.Neighbor, alternate);
                    __context.Path.add(__context.Neighbor, __context.Current);
                }
            });
        }
        ,distanceTo: function (other) {
            return __context.__$Graph.distance.call(__context.Graph, this, other);
        }
};
this.__$Graph = {        distance: function (from, to) {
            if (from === to)
                return 0;
            return __context.Graph.nodes.get(from).get(to) || Infinity;
        }
        ,neighbors: function (node) {
            return __context.Graph.nodes.get(node);
        }
};
this.__$Tentative = {};
this.__$Unvisited = {        findNearest: function () {
            var nearest = undefined, distance = Infinity;
            __context.Unvisited.each(function (node) {
                var dist = __context.Tentative.get(node);
                if (dist < distance) {
                    nearest = node;
                    distance = dist;
                }
            });
            return nearest;
        }
};
this.__$Path = {        to: function (to) {
            var path = [to], cur = to;
            while (cur != __context.Initial) {
                cur = __context.Path.get(cur);
                path.unshift(cur);
                if (cur === undefined) {
                    return undefined;
                }
            }
            return path;
        }
};
    this.bindRoles = function (initial, destination, graph) {
        __context.Initial = initial;
        __context.Graph = graph;
        __context.Tentative = new HashMap();
        __context.Unvisited = new HashMap();
        __context.Path = new HashMap();

        this.destination = destination;
    };
    //Run the use case
    this.run = function () {
        __context.Graph.nodes.each(function (node) {
            __context.Unvisited.add(node);
            __context.Tentative.add(node, Infinity);
        });
        __context.Tentative.add(__context.Initial, 0);
        __context.Current = __context.Initial;
        __context.__$Current.markVisited.call(__context.Current);
        while (!__context.Unvisited.isEmpty()) {
            __context.__$Current.relaxDistances.call(__context.Current);
            __context.__$Current.markVisited.call(__context.Current);
            if (!__context.Unvisited.has(this.destination))
                break;
            __context.Current = __context.__$Unvisited.findNearest.call(__context.Unvisited);
            if (__context.Current === undefined)
                break;
        }
        return __context.__$Path.to.call(__context.Path, this.destination);
    };







});
module.exports = CalculateShortestPath;

