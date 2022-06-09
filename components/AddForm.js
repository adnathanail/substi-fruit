function AddForm({ title, form, addButtonText, addButtonFunction, errorText }) {
  return (
    <div className="card card-body mb-3">
      {form}
      <button
        type="button"
        className="btn btn-primary"
        onClick={addButtonFunction}
      >
        {addButtonText}
      </button>
      {errorText && (
        <div className="alert alert-warning mt-3 mb-0">{errorText}</div>
      )}
    </div>
  );
}

export default AddForm;
