import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import FeedbackForm from "@components/FeedbackForm";
import faunadb from "faunadb";
import { useEffect, useState } from "react";

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
    <div className="container">
      <Head>
        <title>Next.js Toolbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Next.js Toolbox" />
        <hr />
        {fruits.map((fruit) => {
          return fruit["fruitName"];
        })}
        {fruitConnections.map((fruitConnection) => {
          return fruitConnection["fruit1"] + fruitConnection["fruit2"];
        })}
        <p className="description">
          Here's an example of a Netlify Form! When you fill this out, the
          submissions can be found in the Netlify Admin site.
        </p>
        <FeedbackForm />
        {/*<JokeBlock />*/}
      </main>
      <Footer />
    </div>
  );
}
