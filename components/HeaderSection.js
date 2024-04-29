import AddFruitForm from "@components/AddFruitForm";
import AddFruitConnectionForm from "@components/AddFruitConnectionForm";

export function HeaderSection({ client, q, fruits, getFruits, fruitConnections, getFruitConnections }) {
  return (
    <>
      <h1>Substi-fruit</h1>
      <p>I saw a TikTok that pointed out that if you asked someone for a strawberry they could reasonable offer a raspberry but not a kiwi; apple, pear, not pineapple; etc.</p>
      <p>I am curious which fruit substitutions people find acceptable</p>
      <p>See my <a href="https://www.adnathanail.dev/posts/_2022-06-09-substi-fruit">blog post</a> for a full write up</p>
      <div className="card card-body mb-3">
        <AddFruitForm client={client} q={q} fruits={fruits} getFruits={getFruits} />
        <hr />
        <AddFruitConnectionForm client={client} q={q} fruits={fruits} fruitConnections={fruitConnections} getFruitConnections={getFruitConnections} />
      </div>
    </>
  );
}
