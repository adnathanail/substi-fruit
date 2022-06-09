import { useState } from "react";

function AddFruitConnectionForm({
  client,
  q,
  fruits,
  fruitConnections,
  getFruitConnections,
}) {
  const [errorText, setErrorText] = useState("");

  const addFruitConnection = async () => {
    let fruit1 = document.querySelector("#fruit1").value;
    fruit1 = fruit1.toLowerCase().replaceAll(" ", "");
    let fruit2 = document.querySelector("#fruit2").value;
    fruit2 = fruit2.toLowerCase().replaceAll(" ", "");

    if (fruit1 === "") {
      setErrorText(`Fruit 1 is required`);
      return;
    }
    if (fruit2 === "") {
      setErrorText(`Fruit 2 is required`);
      return;
    }

    if (fruit1 === fruit2) {
      setErrorText(`You cannot link a fruit to itself`);
      return;
    }

    const fruitNames = fruits.map((f) => f["fruitName"]);

    if (!fruitNames.includes(fruit1)) {
      setErrorText(`Fruit with name '${fruit1}' does not exist`);
      return;
    }
    if (!fruitNames.includes(fruit2)) {
      setErrorText(`Fruit with name '${fruit2}' does not exist`);
      return;
    }

    document.querySelector("#fruit1").value = "";
    document.querySelector("#fruit2").value = "";
    setErrorText("");

    let fromFruit, toFruit;
    if (fruit1 < fruit2) {
      fromFruit = fruit1;
      toFruit = fruit2;
    } else {
      toFruit = fruit1;
      fromFruit = fruit2;
    }

    // Refresh latest fruit connections
    await getFruitConnections();
    let newFruitConnections = { ...fruitConnections };
    // Add empty dict if this fruit has never connected before
    if (!(fromFruit in newFruitConnections)) {
      newFruitConnections[fromFruit] = {};
    }
    // Add zeroed link if these fruits have never connected before
    if (!(toFruit in newFruitConnections[fromFruit])) {
      newFruitConnections[fromFruit][toFruit] = 0;
    }

    newFruitConnections[fromFruit][toFruit] += 1;

    await client.query(
      q.Update(q.Ref(q.Collection("fruitConnections"), "333956009436381383"), {
        data: newFruitConnections,
      })
    );
    await getFruitConnections();
  };

  return (
    <div className="row">
      <div className="col-12 col-md-5">
        <input
          type="text"
          list="fruit1Options"
          className="form-control mb-3 mb-md-0"
          id="fruit1"
          placeholder="Enter fruit name"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              addFruitConnection().then((_) => {});
            }
          }}
        />
        <datalist id="fruit1Options">
          {fruits.map((f) => (
            <option value={f.fruitName} key={f.fruitName} />
          ))}
        </datalist>
      </div>
      <div className="col-12 col-md-5">
        <input
          type="text"
          list="fruit2Options"
          className="form-control mb-3 mb-md-0"
          id="fruit2"
          placeholder="Enter fruit name"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              addFruitConnection().then((_) => {});
            }
          }}
        />
        <datalist id="fruit2Options">
          {fruits.map((f) => (
            <option value={f.fruitName} key={f.fruitName} />
          ))}
        </datalist>
      </div>
      <div className="col-12 col-md-2">
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={addFruitConnection}
        >
          Add fruit connection
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

export default AddFruitConnectionForm;
