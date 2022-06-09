import AddForm from "@components/AddForm";

function AddFruitForm({ client, q, getFruits }) {
  const addFruit = async () => {
    const fruitName = document.querySelector("#fruitName").value;

    document.querySelector("#fruitName").value = "";

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
    />
  );
}

export default AddFruitForm;
