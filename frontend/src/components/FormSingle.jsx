import { useState } from "react";

const FormSingle = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  console.log(name);
  console.log(file);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      fetch("http://localhost:8000/upload_single", {
        method: "POST",
        body: formData,
      })
        .then((res) => console.log(res))
        .catch((err) => console.log("Error occured", err));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <h2>Single File</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="single-file">Select Single file</label>
          <input
            id="single-file"
            type="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormSingle;
