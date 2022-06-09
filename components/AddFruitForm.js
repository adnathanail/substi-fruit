import AddForm from "@components/AddForm";
import { useState } from "react";

function AddFruitForm({ client, q, getFruits }) {
  const [errorText, setErrorText] = useState("");

  const addFruit = async () => {
    const fruitName = document.querySelector("#fruitName").value;

    if (fruitName === "") {
      setErrorText(`Fruit name is required`);
      return;
    }

    document.querySelector("#fruitName").value = "";
    setErrorText("");

    await client.query(
      q.Create(q.Collection("fruits"), { data: { fruitName: fruitName } })
    );
    await getFruits();
  };

  return (
    <AddForm
      form={
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
      }
      addButtonText="Add fruit"
      addButtonFunction={addFruit}
      errorText={errorText}
    />
  );
}

export default AddFruitForm;
