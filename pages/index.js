import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import FeedbackForm from "@components/FeedbackForm";
import faunadb from "faunadb";
import { useEffect, useState } from "react";

export default function Home() {
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (fruits.length === 0) {
      getFruits().then((_) => {});
    }
  }, []);

  const getFruits = async () => {
    // Instantiate a client
    const q = faunadb.query;
    const client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNA_DB_SECRET,
      domain: "db.eu.fauna.com",
      port: 443,
      scheme: "https",
    });
    // Get all fruits
    client
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection("fruits"))),
          q.Lambda((x) => q.Get(x))
        )
      )
      .then((res) => {
        setFruits(res["data"].map((fruit_object) => fruit_object["data"]));
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
