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
    let connections = await client.query(
      q.Get(q.Ref(q.Collection("fruitConnections"), "333956009436381383"))
    );
    if ("data" in connections) {
      setFruitConnections(connections["data"]);
    } else {
      setFruitConnections({});
    }
  };

  return (
    <div className="container mt-4" id="main">
      <h1>Substi-fruit</h1>
      <p>
        I saw a tiktok that pointed out that if you asked someone for a
        strawberry they could reasonable offer a raspberry but not a kiwi;
        apple, pear, not pineapple; etc.
      </p>
      <p>I am curious which fruit substitutions people find acceptable</p>
      <div className="card card-body">
        <AddFruitForm
          client={client}
          q={q}
          fruits={fruits}
          getFruits={getFruits}
        />
        <hr />
        <AddFruitConnectionForm
          client={client}
          q={q}
          fruits={fruits}
          fruitConnections={fruitConnections}
          getFruitConnections={getFruitConnections}
        />
      </div>

      <RelationshipGraph fruits={fruits} fruitConnections={fruitConnections} />
    </div>
  );
}
