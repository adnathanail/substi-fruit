import faunadb from "faunadb";
import { useEffect, useState } from "react";
import RelationshipGraph from "@components/RelationshipGraph";
import AddFruitForm from "@components/AddFruitForm";
import AddFruitConnectionForm from "@components/AddFruitConnectionForm";

// Instantiate a client
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNA_DB_SECRET,
  domain: "db.eu.fauna.com",
  port: 443,
  scheme: "https",
});

export default function Home() {
  const [fruits, setFruits] = useState([]);
  const [fruitConnections, setFruitConnections] = useState([]);

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (fruits.length === 0) {
      getFruits().then((_) => {});
    }
    if (fruitConnections.length === 0) {
      getFruitConnections().then((_) => {});
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
    // Get all fruits
    client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("fruitConnections"))),
          q.Lambda((x) => q.Get(x))
        )
      )
      .then((res) => {
        setFruitConnections(res["data"].map((fc) => fc["data"]));
      });
  };

  return (
    <div className="container mt-4" id="main">
      <RelationshipGraph fruits={fruits} fruitConnections={fruitConnections} />
      <AddFruitForm client={client} q={q} getFruits={getFruits} />
      <AddFruitConnectionForm
        client={client}
        q={q}
        fruits={fruits}
        getFruitConnections={getFruitConnections}
      />
    </div>
  );
}
