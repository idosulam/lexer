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
  };

  const updateFileContentsrc = (index) => {
    const file = srcFiles[index];
    setSelectedFile(file.file_name);
    setFileContent(file.file);
  };

  return (
    <div style={{position: 'fixed',paddingLeft: '140px' }}>
      <div className="App">
        <ul className="file-list">
          {headerFiles.length > 0 && (
            <li>
              <button onClick={() => setHeaderDropdown(!headerDropdown)}>
              {headerDropdown ?(
'v    header')
:(
  '>   header'
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
              {srcdropdown ?(
'v    src')
:(
  '>   src'
                )}
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
        <div className="file-content" style={{overflow : 'scroll'}}>
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
