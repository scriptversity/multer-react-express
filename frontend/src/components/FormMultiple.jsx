import { useState } from "react";

const FormMultiple = () => {
  const [name, setName] = useState("");
  const [files, setFiles] = useState(null);

  console.log(name);
  console.log(files);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting...");
    try {
      const formData = new FormData();
      formData.append("name", name);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      fetch("http://localhost:8000/upload_files", {
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
    setFiles(e.target.files);
  };

  return (
    <div>
      <h2>Multiple File</h2>
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
          <label htmlFor="multiple-files">Select Multiple Files</label>
          <input
            id="multiple-files"
            type="file"
            name="files"
            onChange={handleFileChange}
            multiple
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormMultiple;
