function PromptInput({
  value,
  onChange,
  onSubmit,
  loading
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit();
  };

  return (
    <form
      className="prompt-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="study-input">
        Paste your notes or study material
      </label>

      <textarea
        id="study-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Java Collections include List, Set, Map..."
        rows={10}
        maxLength={5000}
        disabled={loading}
      />

      <div className="input-footer">
        <span>
          {value.length}/5000
        </span>

        <button
          type="submit"
          disabled={loading || value.trim().length < 10}
        >
          {loading
            ? "Generating..."
            : "Generate Study Set"}
        </button>
      </div>
    </form>
  );
}

export default PromptInput;