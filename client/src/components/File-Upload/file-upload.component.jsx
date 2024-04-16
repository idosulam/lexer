import React, { useRef, useState } from "react";
import "./file-upload.css";

import {
  FileUploadContainer,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel,
} from "./file-upload.styles";

const KILO_BYTES_PER_BYTE = 1000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => (bytes / KILO_BYTES_PER_BYTE).toFixed(1);

const FileUpload = ({ label, updateFilesCb, ...otherProps }) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (!otherProps.multiple) {
        return { file };
      }

      files[file.name] = file;
    }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };
  return (
    <>
      <FileUploadContainer>
        <InputLabel>{label}</InputLabel>
        <DragDropText
          className="codemap"
          style={{ marginTop: "-2rem", fontFamily: "jost" }}
        >
          Code Map
        </DragDropText>
        <UploadFileBtn type="file" onClick={handleUploadBtnClick}>
          <span style={{ fontFamily: "jost" }}> Upload Files</span>
          <input
            style={{
              width: "1%",
              opacity: "0",
            }}
            type="file"
            directory=""
            webkitdirectory=""
            ref={fileInputField}
            onChange={handleNewFileUpload}
            title=""
            value=""
            {...otherProps}
          />
        </UploadFileBtn>
      </FileUploadContainer>
      <FilePreviewContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        <PreviewList style={{ height: "500px", overflowY: "auto" }}>
          {Object.keys(files).map((fileName, index) => {
            let file = files[fileName];
            let isImageFile = file.type.split("/")[0] === "image";
            return (
              <PreviewContainer key={fileName}>
                <div>
                  {isImageFile && (
                    <ImagePreview
                      src={URL.createObjectURL(file)}
                      alt={`file preview ${index}`}
                    />
                  )}
                  <FileMetaData isImageFile={isImageFile}>
                    <span
                      style={{
                        fontFamily: "jost",
                        color: "#000",
                        fontSize: "1.5rem",
                      }}
                    >
                      {file.name}
                    </span>
                    <aside>
                      <span style={{ fontFamily: "jost", color: "#000" }}>
                        {convertBytesToKB(file.size)} kb
                      </span>
                      <RemoveFileIcon className="fas fa-trash-alt" />
                      <button
                        className="delete"
                        onClick={() => removeFile(fileName)}
                        style={{ fontFamily: "jost", color: "#000" }}
                      >
                        <span class="text">remove</span>
                        <span class="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                          </svg>
                        </span>
                      </button>{" "}
                    </aside>
                  </FileMetaData>
                </div>
              </PreviewContainer>
            );
          })}
        </PreviewList>
      </FilePreviewContainer>
    </>
  );
};

export default FileUpload;
