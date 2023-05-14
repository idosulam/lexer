import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import "./Show.css";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Files from "../Files/Files.jsx";
import Graph from "../Graph/Graph.jsx";

function Show() {
  const [file_list, set_file_list] = useState([]);
  const [jsonTree, setJsonTree] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Files");
  const [wanted_file, setWantedFile] = useState("main.c");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectName = params.get("project_name");
  // const id = params.get("id");

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/api/file_search?project_name=${projectName}`
    ).then((response) => {
      if (response.status === 200) {
        set_file_list(response.data);
      }
    });
  }, [projectName]);

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/api/json_search?project_name=${projectName}`
    ).then((response) => {
      if (response.status === 200) {
        const jsonobj = JSON.parse(response.data[0]["json_tree"]);
        setJsonTree(jsonobj);
      }
    });
  }, [jsonTree, projectName]);

  const handleSidebarItemClick = (item) => {
    setWantedFile('')
    setSelectedItem(item);
  };
  const handleSetWantedFile = (file) => {
    
    setWantedFile(file);
  };

  useEffect(() => {
    if(wanted_file)
    setSelectedItem('Files');
  }, [wanted_file]);
  return (
    <>
      <Sidebar
        onItemClick={handleSidebarItemClick}
        selectedItem={selectedItem}
      />

      <div className="app" style={{ backgroundColor: "#000" }}>
        <div className="title-page">Project Name : {projectName}</div>
        <div className="content">
          {selectedItem === "Files" && (
            <Files files={file_list} wanted_file={wanted_file} />
          )}
          {selectedItem === "Graph" && (
            <Graph
              tree={jsonTree}
              projectName={projectName}
              onSetWantedFile={handleSetWantedFile}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Show;
