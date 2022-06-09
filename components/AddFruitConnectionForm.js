import AddForm from "@components/AddForm";
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
    const fruit1 = document.querySelector("#fruit1").value;
    const fruit2 = document.querySelector("#fruit2").value;

    if (fruit1 === "") {
      setErrorText(`Fruit 1 is required`);
      return;
    }
    if (fruit2 === "") {
      setErrorText(`Fruit 2 is required`);
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

    let newFruitConnections = { ...fruitConnections };
    if (!(fromFruit in newFruitConnections)) {
      newFruitConnections[fromFruit] = {};
    }
    if (!(toFruit in newFruitConnections[fromFruit])) {
      newFruitConnections[fromFruit][toFruit] = 0;
    }

    newFruitConnections[fromFruit][toFruit] += 1;

    await client.query(
      q.Update(q.Ref(q.Collection("fruitConnections"), "333954507941609671"), {
        data: newFruitConnections,
      })
    );
    await getFruitConnections();
  };

  return (
    <AddForm
      form={
        <div className="row">
          <div className="col-6">
            <div className="mb-3">
              <label htmlFor="fruit1" className="form-label">
                Fruit 1
              </label>
              <input
                type="text"
                list="fruit1Options"
                className="form-control"
                id="fruit1"
              />
              <datalist id="fruit1Options">
                {fruits.map((f) => (
                  <option value={f.fruitName} key={f.fruitName} />
                ))}
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
                {fruits.map((f) => (
                  <option value={f.fruitName} key={f.fruitName} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
      }
      addButtonText="Add fruit connection"
      addButtonFunction={addFruitConnection}
      errorText={errorText}
    />
  );
}

export default AddFruitConnectionForm;
