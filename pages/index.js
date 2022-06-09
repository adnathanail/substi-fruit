import faunadb from "faunadb";
import { useEffect, useState } from "react";
import RelationshipGraph from "@components/RelationshipGraph";

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

  const addFruit = async () => {
    const fruitName = document.querySelector("#fruitName").value;

    document.querySelector("#fruitName").value = "";

    await client.query(
      q.Create(q.Collection("fruits"), { data: { fruitName: fruitName } })
    );
    await getFruits();
  };

  const addFruitConnection = async () => {
    const fruit1 = document.querySelector("#fruit1").value;
    const fruit2 = document.querySelector("#fruit2").value;

    document.querySelector("#fruit1").value = "";
    document.querySelector("#fruit2").value = "";

    const fruitNames = fruits.map((f) => f["fruitName"]);

    if (!fruitNames.includes(fruit1) || !fruitNames.includes(fruit2)) {
      return;
    }

    await client.query(
      q.Create(q.Collection("fruitConnections"), {
        data: { fruit1: fruit1, fruit2: fruit2 },
      })
    );
    await getFruitConnections();
  };

  return (
    <div className="container mt-4" id="main">
      <RelationshipGraph fruits={fruits} fruitConnections={fruitConnections} />
      <div className="card card-body mb-3">
        <h3>Fruit</h3>
        <hr />
        <ul className="mb-0">
          {fruits.map((fruit) => {
            return <li key={fruit["fruitName"]}>{fruit["fruitName"]}</li>;
          })}
        </ul>
        <hr />
        <div className="mb-3">
          <label htmlFor="fruitName" className="form-label">
            Fruit name
          </label>
          <input
            type="text"
            className="form-control"
            id="fruitName"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                addFruit().then((_) => {});
              }
            }}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={addFruit}>
          Add fruit
        </button>
      </div>

      <div className="card card-body mb-3">
        <h3>Fruit connections</h3>
        <hr />
        <ul className="mb-0">
          {fruitConnections.map((fruitConnection) => {
            return (
              <li key={fruitConnection["fruit1"] + fruitConnection["fruit2"]}>
                {fruitConnection["fruit1"]} to {fruitConnection["fruit2"]}
              </li>
            );
          })}
        </ul>
        <hr />
        <div className="row">
          <div className="col-6">
            <div className="mb-3">
              <label htmlFor="fruit1" className="form-label">
                Fruit 1
              </label>
              <input type="text" list="fruit1Options" className="form-control" id="fruit1" />
              <datalist id="fruit1Options">
                {fruits.map(f => <option value={f.fruitName} key={f.fruitName}></option>)}
              </datalist>
            </div>
          </div>
          <div className="col-6">
            <div className="mb-3">
              <label htmlFor="fruit2" className="form-label">
                Fruit 2
              </label>
              <input
                type="text"
                list="fruit2Options"
                className="form-control"
                id="fruit2"
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    addFruitConnection().then((_) => {});
                  }
                }}
              />
              <datalist id="fruit2Options">
                {fruits.map(f => <option value={f.fruitName} key={f.fruitName}></option>)}
              </datalist>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={addFruitConnection}
        >
          Add fruit connection
        </button>
      </div>
    </div>
  );
}
