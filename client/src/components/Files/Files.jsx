import React, { useState } from "react";
import "./Files.css";

function Files(props) {


    const [selectedFile, setSelectedFile] = useState('');
    const [fileContent, setFileContent] = useState('');
  
    const updateFileContent = (index) => {
        const file =props.files[index]
        setSelectedFile(file.file_name);
        setFileContent(file.file);
        console.log(file.file_name + file.file);
    
      };
  return (
    <div className="container">
    <div className="App">
    <ul className="file-list">
      {props.files.map((file,index) =>(
    <li key={index}>
      <button
      className={selectedFile === file.file_name ? 'selected' : ''}
      onClick={() => updateFileContent(index)}
      >
      {file.file_name}
      </button>
    </li>
      ))}
    </ul>
    <div className="file-content">
  <h3>{selectedFile}</h3>
  <pre>
  {fileContent.split('\n').map((line, i) => (
    <div>
    <code className="line-number" key={i}>{`${i+1}.`}</code>
    <code className="code-line">{line.trim()}</code>

    </div>
))}
</pre>


  
  </div>
</div>
</div>
  );
}

export default Files;
