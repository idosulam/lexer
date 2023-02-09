import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Show() {
  
  const [projectsList, setProjects] = useState([]);
  const [jsonTree, setJsonTree] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectName = params.get("project_name");
  const id = params.get("id");

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/file_search?project_name=${projectName}`)
      .then((response) => {
        if (response.status === 200) {
          setProjects(response.data);
        }
      });
  }, [projectName]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/json_search?project_name=${projectName}`)
      .then((response) => {
        if (response.status === 200) {
          const jsonobj = JSON.parse(response.data[0]["json_tree"]);
          setJsonTree(jsonobj);
        }
      });
  }, [jsonTree,projectName]);

  return (
    <div>
      {
        console.log(jsonTree)
      }
    </div>
  );
}

export default Show;
