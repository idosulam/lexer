import React, { useState } from "react";
import "./Files.css";

function Files(props) {
  const headerFiles = props.files.filter((file) => file.file_name.endsWith(".h"));
  const srcFiles = props.files.filter((file) => file.file_name.endsWith(".c"));
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [headerDropdown, setHeaderDropdown] = useState(false);
  const [srcdropdown, setsrcdropdown] = useState(false);


  const updateFileContentheader = (index) => {
    const file = headerFiles[index];
    setSelectedFile(file.file_name);
    setFileContent(file.file);
    console.log(file.file_name + file.file);
  };

  const updateFileContentsrc = (index) => {
    const file = srcFiles[index];
    setSelectedFile(file.file_name);
    setFileContent(file.file);
    console.log(file.file_name + file.file);
  };

  return (
    <div className="container">
      <div className="App">
        <ul className="file-list">
          {headerFiles.length > 0 && (
            <li>
              <button onClick={() => setHeaderDropdown(!headerDropdown)}>
                Headers
              </button>
              {headerDropdown && (
                <ul className="dropdown">
                  {headerFiles.map((file, index) => (
                    <li key={index}>
                      <button
                        className={
                          selectedFile === file.file_name ? "selected" : ""
                        }
                        onClick={() => updateFileContentheader(index)}
                      >
                        {file.file_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
           {headerFiles.length > 0 && (
            <li>
              <button onClick={() => setsrcdropdown(!srcdropdown)}>
                src
              </button>
              {srcdropdown && (
                <ul className="dropdown">
                  {srcFiles.map((file, index) => (
                    <li key={index}>
                      <button
                        className={
                          selectedFile === file.file_name ? "selected" : ""
                        }
                        onClick={() => updateFileContentsrc(index)}
                      >
                        {file.file_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
        <div className="file-content">
          <h3>{selectedFile}</h3>
          <pre>
            {fileContent.split("\n").map((line, i) => (
              <div key={i}>
                <code className="line-number">{`${i + 1}.`}</code>
                <code className="code-line">{line}</code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Files;
