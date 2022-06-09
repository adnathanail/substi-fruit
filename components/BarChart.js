import * as d3 from 'd3';
import {useD3} from "../hooks/useD3";


function BarChart({ fruits, fruitConnections }) {
  const ref = useD3(
    (svg_element) => {
      const fruitNames = fruits.map(f => f["fruitName"]);
      console.log("useD3");
      let nodes = fruitNames.map((f, index) => ({id: index, name: f}));
      let links = fruitConnections.filter(fc => {
          return fruitNames.includes(fc["fruit1"]) && fruitNames.includes(fc["fruit2"]);
      }).map(fc => {
        return {
          source: fruitNames.indexOf(fc["fruit1"]),
          target: fruitNames.indexOf(fc["fruit2"])
        }
      });
      console.log(nodes);
      console.log(links);

          // Initialize the links
          var link = svg_element
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
              .style("stroke", "#aaa")

          // Initialize the nodes
          var node = svg_element
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
              .attr("r", 20)
              .style("fill", "#69b3a2")

          // Let's list the force we wanna apply on the network
          var simulation = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
              .force("link", d3.forceLink()                               // This force provides links between nodes
                    .id(function(d) { return d.id; })                     // This provide  the id of a node
                    .links(links)                                    // and this the list of links
              )
              .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
              .force("center", d3.forceCenter(200, 200))     // This force attracts nodes to the center of the grap area
              // .on("end", ticked);

          // This function is run at each iteration of the force algorithm, updating the nodes position.
          // function ticked() {
          //   link
          //       .attr("x1", function(d) { return d.source.x; })
          //       .attr("y1", function(d) { return d.source.y; })
          //       .attr("x2", function(d) { return d.target.x; })
          //       .attr("y2", function(d) { return d.target.y; });
          //
          //   node
          //        .attr("cx", function (d) { return d.x+6; })
          //        .attr("cy", function(d) { return d.y-6; });
          // }

    },
    [fruits, fruitConnections]
  );

  return (
      <svg width="400" height="400">
        <g transform="translate(40, 10)" ref={ref}></g>
      </svg>
    // <svg
    //   ref={ref}
    //   style={{
    //     height: 500,
    //     width: "100%",
    //     marginRight: "0px",
    //     marginLeft: "0px",
    //   }}
    // >
    //   <g className="plot-area" />
    //   <g className="x-axis" />
    //   <g className="y-axis" />
    // </svg>
  );
}

export default BarChart;
