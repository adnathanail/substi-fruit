import faunadb from "faunadb";
import { useEffect, useState } from "react";
import RelationshipGraph from "@components/RelationshipGraph";
import StatsCard from "@components/StatsCard";
import { HeaderSection } from "@components/HeaderSection";

// Instantiate a client
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNA_DB_SECRET,
  domain: "db.eu.fauna.com",
  port: 443,
  scheme: "https",
});

export default function Home() {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [fruits, setFruits] = useState([]);
  const [fruitConnections, setFruitConnections] = useState({});

  useEffect(() => {
    if (!initialLoaded) {
      getFruits().then((_) => {});
      getFruitConnections().then((_) => {});
      setInitialLoaded(true);
    }
  }, []);

  const getFruits = async () => {
    // Get all fruits
    client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("fruits"))),
          q.Lambda((x) => q.Get(x))
        )
      )
      .then((res) => {
        setFruits(res["data"].map((f) => f["data"]));
      });
  };

  const getFruitConnections = async () => {
    let connections = await client.query(q.Get(q.Ref(q.Collection("fruitConnections"), "333956009436381383")));
    if ("data" in connections) {
      setFruitConnections(connections["data"]);
    } else {
      setFruitConnections({});
    }
  };

  return (
    <div className="container mt-4" id="main">
      <HeaderSection client={client} q={q} fruits={fruits} getFruits={getFruits} fruitConnections={fruitConnections} getFruitConnections={getFruitConnections} />

      <RelationshipGraph fruits={fruits} fruitConnections={fruitConnections} />
      <StatsCard fruits={fruits} fruitConnections={fruitConnections} />
    </div>
  );
}
