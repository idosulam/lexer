import React, { useState, useEffect } from "react";
import "./Files.css";
import { FaArrowAltCircleDown, FaArrowAltCircleRight } from "react-icons/fa";
function Files(props) {
  const [srcFiles, setsrcFiles] = useState([]);
  const [headerFiles, setheaderFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [headerDropdown, setHeaderDropdown] = useState(false);
  const [srcdropdown, setsrcdropdown] = useState(false);

  const updateFileContentheader = (index) => {
    const file = headerFiles[index];
    setSelectedFile(file.file_name);
    setFileContent(file.file);
  };
  useEffect(() => {
    const headerFilesprops = props.files.filter((file) =>
      file.file_name.endsWith(".h")
    );
    const srcFilesprops = props.files.filter((file) =>
      file.file_name.endsWith(".c")
    );

    setheaderFiles(headerFilesprops);
    setsrcFiles(srcFilesprops);
  }, [props.files]);


  const updateFileContentsrc = (index) => {
    const file = srcFiles[index];
    setSelectedFile(file.file_name);
    setFileContent(file.file);
  };

  return (
    <div style={{ paddingLeft: "140px", paddingTop: "30px" }}>
      <div className="App" style={{ backgroundColor: "#000" }}>
        <ul className="file-list">
          {headerFiles.length > 0 && (
            <li>
              <button
                onClick={() => setHeaderDropdown(!headerDropdown)}
                style={{ fontFamily: "jost" }}
              >
                {headerDropdown ? (
                  <button>
                    <FaArrowAltCircleDown /> includes
                  </button>
                ) : (
                  <button>
                    <FaArrowAltCircleRight /> includes
                  </button>
                )}
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
                        style={{ fontFamily: "jost" }}
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
              <button
                onClick={() => setsrcdropdown(!srcdropdown)}
                style={{ fontFamily: "jost" }}
              >
                {srcdropdown ? (
                  <button>
                    <FaArrowAltCircleDown /> src
                  </button>
                ) : (
                  <button>
                    <FaArrowAltCircleRight /> src
                  </button>
                )}{" "}
              </button>
              {srcdropdown && (
                <ul className="dropdown">
                  {srcFiles.map((file, index) => (
                    <li key={index}>
                      <button
                        style={{ fontFamily: "jost" }}
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
        <div
          className="file-content"
          style={{
            overflow: "auto",
            backgroundColor: "#333",
          }}
        >
          <h3 style={{ color: "#fff", fontFamily: "jost" }}>{selectedFile}</h3>
          <pre style={{ fontFamily: "jost" }}>
            {fileContent.split("\n").map((line, i) => (
              <div key={i}>
                <code
                  className="line-number"
                  style={{ color: "#fff", fontFamily: "jost" }}
                >{`${i + 1}.`}</code>
                <code
                  className="code-line"
                  style={{ color: "#fff", fontFamily: "jost" }}
                >
                  {line}
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Files;
