function AddForm({ title, form, addButtonText, addButtonFunction }) {
  return (
    <div className="card card-body mb-3">
      <h3>{title}</h3>
      <hr />
      {form}
      <button
        type="button"
        className="btn btn-primary"
        onClick={addButtonFunction}
      >
        {addButtonText}
      </button>
    </div>
  );
}

export default AddForm;
