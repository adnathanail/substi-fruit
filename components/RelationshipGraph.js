import { useEffect, useState } from "react";
import Graph from "react-graph-vis";

const options = {
  layout: {
    hierarchical: false,
  },
  edges: {
    color: "#000000",
  },
};

function RelationshipGraph({ fruits, fruitConnections }) {
  const [state, setState] = useState({
    counter: 0,
    graph: {
      nodes: [],
      edges: [],
    },
  });

  useEffect(() => {
    const fruitNames = fruits.map((f) => f["fruitName"]);
    let nodes = fruitNames.map((f, index) => {
      return { id: index, label: f, color: "#fff" };
    });

    let edges = [];
    for (const [fromFruit, connections] of Object.entries(fruitConnections)) {
      for (const [toFruit, tally] of Object.entries(connections)) {
        edges.push({
          from: fruitNames.indexOf(fromFruit),
          to: fruitNames.indexOf(toFruit),
          width: tally,
          label: tally.toString(),
        });
      }
    }
    setState({
      counter: nodes.length,
      graph: { nodes, edges },
    });
  }, [fruits, fruitConnections]);

  const { graph, events } = state;

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      style={{ height: "400px" }}
    />
  );
}

export default RelationshipGraph;
