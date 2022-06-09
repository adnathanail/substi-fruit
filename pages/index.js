import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import FeedbackForm from "@components/FeedbackForm";
import faunadb from "faunadb";
import {useEffect, useState} from "react";

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
          q.Paginate(q.Documents(q.Collection("fruits1"))),
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

  async function addFruit() {
    const fruitName = document.querySelector('#fruitName').value;

    document.querySelector('#fruitName').value = "";

    await client.query(
      q.Create(
          q.Collection("fruits1"),
          { data: {"fruitName": fruitName}}
      )
    )
    await getFruits();
  }

  async function addFruitConnection() {
    const fruit1 = document.querySelector('#fruit1').value;
    const fruit2 = document.querySelector('#fruit2').value;

    document.querySelector('#fruit1').value = "";
    document.querySelector('#fruit2').value = "";

    await client.query(
      q.Create(
          q.Collection("fruitConnections"),
          { data: {"fruit1": fruit1, "fruit2": fruit2}}
      )
    )
    await getFruitConnections();
  }

  return (
    <div className="container mt-4">
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
          <label htmlFor="fruitName" className="form-label">Fruit name</label>
          <input type="text" className="form-control" id="fruitName" onKeyPress={event => {
            if (event.key === 'Enter') {
                  addFruit().then(_ => {})
                }
          }} />
        </div>
        <button type="button" className="btn btn-primary" onClick={addFruit}>Add fruit</button>
      </div>

      <div className="card card-body mb-3">
        <h3>Fruit connections</h3>
        <hr />
        <ul className="mb-0">
          {fruitConnections.map((fruitConnection) => {
            return <li key={fruitConnection["fruit1"] + fruitConnection["fruit2"]}>{fruitConnection["fruit1"]} to {fruitConnection["fruit2"]}</li>;
          })}
        </ul>
        <hr />
        <div className="row">
          <div className="col-6">
            <div className="mb-3">
              <label htmlFor="fruit1" className="form-label">Fruit 1</label>
              <input type="text" className="form-control" id="fruit1" />
            </div>
          </div>
          <div className="col-6">
            <div className="mb-3">
              <label htmlFor="fruit2" className="form-label">Fruit 2</label>
              <input type="text" className="form-control" id="fruit2" onKeyPress={event => {
                if (event.key === 'Enter') {
                      addFruitConnection().then(_ => {})
                    }
              }} />
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={addFruitConnection}>Add fruit connection</button>
      </div>

      {/*<Head>*/}
      {/*  <title>Next.js Toolbox</title>*/}
      {/*  <link rel="icon" href="/favicon.ico" />*/}
      {/*</Head>*/}

      {/*<main>*/}
      {/*  <Header title="Next.js Toolbox" />*/}
      {/*  <hr />*/}
      {/*  {fruitConnections.map((fruitConnection) => {*/}
      {/*    return fruitConnection["fruit1"] + fruitConnection["fruit2"];*/}
      {/*  })}*/}
      {/*  <p className="description">*/}
      {/*    Here's an example of a Netlify Form! When you fill this out, the*/}
      {/*    submissions can be found in the Netlify Admin site.*/}
      {/*  </p>*/}
      {/*  <FeedbackForm />*/}
      {/*  /!*<JokeBlock />*!/*/}
      {/*</main>*/}
      {/*<Footer />*/}
    </div>
  );
}
