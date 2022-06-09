import { useEffect, useState } from "react";

const reduceSum = (partialSum, a) => partialSum + a;

function StatsCard({ fruits, fruitConnections }) {
  const [numConnections, setnumConnections] = useState(0);
  const [fruitMostUniqueConnections, setFruitMostUniqueConnections] = useState("");
  const [fruitMostTotalConnections, setFruitMostTotalConnections] = useState("");

  useEffect(() => {
    // Count the number of connections in the graph
    setnumConnections(
      Object.entries(fruitConnections)
        .map((fc_from) => {
          return Object.entries(fc_from[1])
            .map((fc_to) => {
              return fc_to[1];
            })
            .reduce(reduceSum, 0);
        })
        .reduce(reduceSum, 0)
    );
    let unique_connections = {};
    let total_connections = {};
    for (const [fromFruit, connections] of Object.entries(fruitConnections)) {
      for (const [toFruit, tally] of Object.entries(connections)) {
        if (!(fromFruit in unique_connections)) {
          unique_connections[fromFruit] = 0;
        }
        if (!(toFruit in unique_connections)) {
          unique_connections[toFruit] = 0;
        }
        if (!(fromFruit in total_connections)) {
          total_connections[fromFruit] = 0;
        }
        if (!(toFruit in total_connections)) {
          total_connections[toFruit] = 0;
        }
        unique_connections[fromFruit] += 1;
        unique_connections[toFruit] += 1;
        total_connections[fromFruit] += tally;
        total_connections[toFruit] += tally;
      }
    }
    let most_unique_fc = Object.entries(unique_connections).reduce((currentWinner, a) => (currentWinner[1] > a[1] ? currentWinner : a), ["", 0]);

    if (most_unique_fc[0].length > 0) {
      setFruitMostUniqueConnections(`${most_unique_fc[0][0].toUpperCase()}${most_unique_fc[0].slice(1)} (${most_unique_fc[1]})`);
    }
    let most_total_fc = Object.entries(total_connections).reduce((currentWinner, a) => (currentWinner[1] > a[1] ? currentWinner : a), ["", 0]);
    if (most_total_fc[0].length > 0) {
      setFruitMostTotalConnections(`${most_total_fc[0][0].toUpperCase()}${most_total_fc[0].slice(1)} (${most_total_fc[1]})`);
    }
  }, [fruits, fruitConnections]);

  return (
    <div className="card my-3">
      <div className="card-body">
        <h1 className="text-center">Stats</h1>
        <div className="row mb-4">
          <div className="col-12 col-md-6 text-center">
            <h2>{fruits.length}</h2>
            <p className="mb-0 text-muted">Unique fruit</p>
          </div>
          <div className="col-12 col-md-6 text-center">
            <h2>{numConnections}</h2>
            <p className="mb-0 text-muted">Fruit connections</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 text-center">
            <h2>{fruitMostUniqueConnections}</h2>
            <p className="mb-0 text-muted">Most unique connections</p>
          </div>
          <div className="col-12 col-md-6 text-center">
            <h2>{fruitMostTotalConnections}</h2>
            <p className="mb-0 text-muted">Most total connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
