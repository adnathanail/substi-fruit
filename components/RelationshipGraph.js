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
    let edges = fruitConnections
      .filter((fc) => {
        return (
          fruitNames.includes(fc["fruit1"]) && fruitNames.includes(fc["fruit2"])
        );
      })
      .map((fc) => {
        return {
          from: fruitNames.indexOf(fc["fruit1"]),
          to: fruitNames.indexOf(fc["fruit2"]),
          // width: 3,
          // label: "3",
        };
      });

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
