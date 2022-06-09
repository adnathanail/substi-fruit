import * as d3 from 'd3';
import {useD3} from "../hooks/useD3";

const data = {
  "nodes": [
    {
      "id": 1,
      "name": "A"
    },
    {
      "id": 2,
      "name": "B"
    },
    {
      "id": 3,
      "name": "C"
    },
    {
      "id": 4,
      "name": "D"
    },
    {
      "id": 5,
      "name": "E"
    },
    {
      "id": 6,
      "name": "F"
    },
    {
      "id": 7,
      "name": "G"
    },
    {
      "id": 8,
      "name": "H"
    },
    {
      "id": 9,
      "name": "I"
    },
    {
      "id": 10,
      "name": "J"
    }
  ],
  "links": [

    {
      "source": 1,
      "target": 2
    },
    {
      "source": 1,
      "target": 5
    },
    {
      "source": 1,
      "target": 6
    },

    {
      "source": 2,
      "target": 3
    },
            {
      "source": 2,
      "target": 7
    }
    ,

    {
      "source": 3,
      "target": 4
    },
     {
      "source": 8,
      "target": 3
    }
    ,
    {
      "source": 4,
      "target": 5
    }
    ,

    {
      "source": 4,
      "target": 9
    },
    {
      "source": 5,
      "target": 10
    }
  ]
};

function BarChart({ fruits, fruitConnections }) {
  const ref = useD3(
    (svg) => {



        // set the dimensions and margins of the graph
        let margin = {top: 10, right: 30, bottom: 30, left: 40},
          width = 400 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var grap = d3.select("#my_dataviz")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
      console.log("TEST1")

        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then(function( data) {
          console.log(data);

          // Initialize the links
          var link = grap
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
              .style("stroke", "#aaa")

          // Initialize the nodes
          var node = grap
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
              .attr("r", 20)
              .style("fill", "#69b3a2")

          // Let's list the force we wanna apply on the network
          var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
              .force("link", d3.forceLink()                               // This force provides links between nodes
                    .id(function(d) { return d.id; })                     // This provide  the id of a node
                    .links(data.links)                                    // and this the list of links
              )
              .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
              .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the grap area
              .on("end", ticked);

          // This function is run at each iteration of the force algorithm, updating the nodes position.
          function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                 .attr("cx", function (d) { return d.x+6; })
                 .attr("cy", function(d) { return d.y-6; });
          }

        });

      // const x = d3
      //   .scaleBand()
      //   .domain(data.map((d) => d.year))
      //   .rangeRound([margin.left, width - margin.right])
      //   .padding(0.1);
      //
      // const y1 = d3
      //   .scaleLinear()
      //   .domain([0, d3.max(data, (d) => d.sales)])
      //   .rangeRound([height - margin.bottom, margin.top]);
      //
      // const xAxis = (g) =>
      //   g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      //     d3
      //       .axisBottom(x)
      //       .tickValues(
      //         d3
      //           .ticks(...d3.extent(x.domain()), width / 40)
      //           .filter((v) => x(v) !== undefined)
      //       )
      //       .tickSizeOuter(0)
      //   );
      //
      // const y1Axis = (g) =>
      //   g
      //     .attr("transform", `translate(${margin.left},0)`)
      //     .style("color", "steelblue")
      //     .call(d3.axisLeft(y1).ticks(null, "s"))
      //     .call((g) => g.select(".domain").remove())
      //     .call((g) =>
      //       g
      //         .append("text")
      //         .attr("x", -margin.left)
      //         .attr("y", 10)
      //         .attr("fill", "currentColor")
      //         .attr("text-anchor", "start")
      //         .text(data.y1)
      //     );
      //
      // grap.select(".x-axis").call(xAxis);
      // grap.select(".y-axis").call(y1Axis);
      //
      // grap
      //   .select(".plot-area")
      //   .attr("fill", "steelblue")
      //   .selectAll(".bar")
      //   .data(data)
      //   .join("rect")
      //   .attr("class", "bar")
      //   .attr("x", (d) => x(d.year))
      //   .attr("width", x.bandwidth())
      //   .attr("y", (d) => y1(d.sales))
      //   .attr("height", (d) => y1(0) - y1(d.sales));
    },
    [data.length]
  );

  return (
      <div id="my_dataviz"></div>
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
