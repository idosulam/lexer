import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import "../../App.css";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Files from "../Files/Files.jsx";
import Graph from "../Graph/Graph.jsx";

function Show() {
  const [file_list, set_file_list] = useState([]);
  const [jsonTree, setJsonTree] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Files");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectName = params.get("project_name");
 // const id = params.get("id");

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/file_search?project_name=${projectName}`).then(
      (response) => {
        if (response.status === 200) {
          set_file_list(response.data);
        }
      }
    );
  }, [projectName]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/json_search?project_name=${projectName}`).then(
      (response) => {
        if (response.status === 200) {
          const jsonobj = JSON.parse(response.data[0]["json_tree"]);
          setJsonTree(jsonobj);
        }
      }
    );
  }, [jsonTree, projectName]);

  const handleSidebarItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="app">
     <h1 className="modern-h1"> {projectName}</h1>
      <Sidebar onItemClick={handleSidebarItemClick} selectedItem={selectedItem} />
      <div className="content">
      {selectedItem === "Files" && <Files files={file_list} />}
      {selectedItem === "Graph" && <Graph tree = {jsonTree}/>}
      </div>
    </div>
  );
}

export default Show;
