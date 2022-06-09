import { useState } from "react";

function AddFruitForm({ client, q, fruits, getFruits }) {
  const [errorText, setErrorText] = useState("");

  const addFruit = async () => {
    let fruitName = document.querySelector("#fruitName").value;
    fruitName = fruitName.toLowerCase().replaceAll(" ", "");

    if (fruitName === "") {
      setErrorText(`Fruit name is required`);
      return;
    }
    const fruitNames = fruits.map((f) => f["fruitName"]);
    if (fruitNames.includes(fruitName)) {
      setErrorText(`'${fruitName}' already existst`);
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
    <div className="row">
      <div className="col-12 col-md-10">
        <input
          type="text"
          className="form-control mb-3 mb-md-0"
          id="fruitName"
          placeholder="Add a fruit before creating a connection with it"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              addFruit().then((_) => {});
            }
          }}
        />
      </div>
      <div className="col-12 col-md-2">
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={addFruit}
        >
          Add fruit
        </button>
      </div>
      {errorText && (
        <div className="col-12">
          <div className="alert alert-warning mt-3 mb-0">{errorText}</div>
        </div>
      )}
    </div>
  );
}

export default AddFruitForm;
