import React, { useState } from "react";
import Tree from "react-d3-tree";
import Axios from "axios";
import "./graph.css";
function Graph(props) {
  const jsonTree = props.tree;
  const projectname = props.projectName;
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [file, setFile] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [list, setList] = useState([
    { parameter: "", value: "", condition: "" },
  ]);
  const [matchingQuery, setMatchingQuery] = useState([]);

  const handleAddField = () => {
    setList([...list, { parameter: "", value: "", condition: "" }]);
  };

  const handleRemoveField = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleInputChange = (e, index) => {
    const newList = [...list];
    newList[index][e.target.name] = e.target.value;
    setList(newList);
  };

  const handleSubmit = async () => {
    for (let i = 0; i < list.length; i++) {
      const field = list[i];
      if (list.length - 1 === i) {
        field.condition = "and";
      }
      if (!field.value || !field.parameter || !field.condition) return;
    }

    const names = new Set();
    printtree(names, jsonTree);
    const promises = [];

    for (const name of names) {
      let sql_query = `SELECT * FROM project.${projectname}_${name} WHERE`;

      for (const field of list) {
        let condition = field.condition;
        let parameter = field.parameter;
        let value = field.value;
        switch (condition) {
          case "and":
            sql_query += ` ${parameter} = '${value}' AND`;
            break;
          case "or":
            sql_query += ` ${parameter} = '${value}' OR`;
            break;
          case "not":
            sql_query += ` ${parameter} != '${value}' AND`;
            break;
          default:
            break;
        }
      }

      sql_query = sql_query.slice(0, -3);
      promises.push(Axios.get(
        `http://localhost:3001/api/check_table?sql_query=${sql_query}`
      ).then( async (response) => {
        if (response.status === 200) {
          if(response.data[0] !== undefined)
          return response.data[0].function_name
        }
      }));
    }
    const match = await Promise.all(promises);
    setMatchingQuery(match.filter((item) => item !== undefined));
    console.log(matchingQuery);


  };

  function printtree(names, root) {
    names.add(root.name);
    root.children.forEach((element) => {
      printtree(names, element);
    });
  }

  const pathClassFunc = (source, target, orientation) => {
    return "important-link";
  };

  function handlinkover(nodeData, target, event) {
    setDialogPosition({ x: event.clientX, y: event.clientY });
    const project = `${projectname}_${target.data.name}`;

    Axios.get(
      `http://localhost:3001/api/getreturn?project_name=${project}`
    ).then(async (response) => {
      if (response.status === 200) {
        const res = response.data[0]["return_type"];
        setFile(`${target.data.name} returns ${res} to ${target.data.parent}`);
      }
    });
    setIsDialogVisible(true);
  }

  function handleLeave() {
    setIsDialogVisible(false);
  }

  function handleZoom(event) {
    setZoomLevel(event.transform.k);
  }

  function updatecolor(nodeDatum) {
    const color = nodeDatum.nodeDatum.color[0];
    const regex = /[^/]*$/;
    const string = `${nodeDatum.nodeDatum.name} from : ${
      regex.exec(nodeDatum.nodeDatum.file)[0]
    }`;
    if (matchingQuery.includes(nodeDatum.nodeDatum.name)){
      return (
        <g onClick={() => console.log(nodeDatum)}>
          <circle className="object" fill={color} r="20" />
          <text fill="black" strokeWidth="1" x="30">
            {string}
          </text>
        </g>
      );
    }
    else{
    return (
      <g onClick={() => console.log(nodeDatum)}>
        <circle fill={color} r="20" />
        <text fill="black" strokeWidth="1" x="30">
          {string}
        </text>
      </g>
    );
    }
  }

  return (
    <>
      <h1>Graph</h1>
      <div style={{ paddingLeft: "100px" }}>
        {list.map((item, index) => (
          <div key={index} style={{ paddingBottom: "20px" }}>
            <div style={{ paddingRight: "20px", display: "inline-block" }}>
              <select
                name="parameter"
                value={item.parameter}
                onChange={(e) => handleInputChange(e, index)}
              >
                <option value="">Choose</option>
                <option value="if_statements">if statement</option>
                <option value="while_statements">while statement</option>
                <option value="return_type">return_type</option>
                <option value="params">parameters</option>
                <option value="variables">variable</option>
              </select>
            </div>

            <div style={{ paddingRight: "20px", display: "inline-block" }}>
              <input
                className="inputsearch"
                name="value"
                value={item.value}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            {list.length - 1 !== index ? (
              <div style={{ paddingRight: "20px", display: "inline-block" }}>
                <select
                  name="condition"
                  value={item.condition}
                  onChange={(e) => handleInputChange(e, index)}
                >
                  <option value="">Choose</option>
                  <option value="not">not</option>
                  <option value="and">and</option>
                  <option value="or">or</option>
                </select>
              </div>
            ) : (
              ``
            )}
            {list.length !== 1 ? (
              <button
                onClick={() => handleRemoveField(index)}
                className="button-28"
              >
                Remove
              </button>
            ) : (
              ``
            )}
          </div>
        ))}
      </div>
      <button
        style={{ marginTop: "20px", marginLeft: "100px", marginRight: "20px" }}
        className="button-28"
        onClick={handleAddField}
      >
        Add
      </button>
      <button
        style={{ marginTop: "20px" }}
        className="button-28"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "100px",
            width: "100%",
            height: "500px",
            paddingTop: "50px",
          }}
        >
          <Tree
            data={jsonTree}
            collapsible={false}
            nodeSize={{ x: 300 / zoomLevel, y: 200 / zoomLevel }}
            onLinkMouseOver={handlinkover}
            onLinkMouseOut={handleLeave}
            orientation="vertical"
            pathClassFunc={pathClassFunc}
            onZoom={handleZoom}
            renderCustomNodeElement={updatecolor}
            separation={{ siblings: 1
              , nonSiblings: 2 }}
          />
          <style>
            {`
            .important-link {
              stroke-width: 5px;
              stroke: black;
            }
            .important-link:hover {
              stroke-width: 10px;
              stroke: blue;
            }
            
          `}
          </style>
          {isDialogVisible && (
            <div
              style={{
                position: "absolute",
                top: dialogPosition.y / zoomLevel + 20,
                left: dialogPosition.x / zoomLevel + 20,
                background: "white",
                border: "1px solid black",
                padding: "10px",
                boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.2)",
                borderRadius: "5px",
                animation: "fadein 0.5s",
              }}
            >
              <p style={{ marginBottom: "10px" }}>{file}</p>
            </div>
          )}
        </div>
        <style>
          {`
          @keyframes fadein {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeout {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
        </style>
      </div>
    </>
  );
}

export default Graph;
