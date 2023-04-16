import React, { useRef, useState } from "react";
import './file-upload.css'

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
        <DragDropText style={{paddingTop : '20px' ,fontFamily : "jost",  color: '#fff'}}>Code Map</DragDropText>
        <UploadFileBtn type="file" onClick={handleUploadBtnClick}>
          <span style={{fontFamily: 'jost'}}> Upload Files</span>
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
        >
      
        </div>
        <PreviewList>
          {Object.keys(files).map((fileName, index) => {
            let file = files[fileName];
            let isImageFile = file.type.split("/")[0] === "image";
            return (
              <PreviewContainer key={fileName}>
                <div >
                  {isImageFile && (
                    <ImagePreview
                      src={URL.createObjectURL(file)}
                      alt={`file preview ${index}`}
                    />
                  )}
                  <FileMetaData isImageFile={isImageFile} >
                    <span style={{fontFamily: 'jost',color: '#000'}}>{file.name}</span>
                    <aside>
                      <span  style={{fontFamily: 'jost',color: '#000'}}>{convertBytesToKB(file.size)} kb</span>
                      <RemoveFileIcon className="fas fa-trash-alt" />
                      <button onClick={() => removeFile(fileName)} style={{fontFamily: 'jost',color: '#000'}}>
                        remove
                      </button>
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
