import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import Axios from "axios";
import { ToastContainer } from "react-toastify";
//import { toast } from "react-toastify";
import Switch from "react-switch";

import "./graph.css";
function Graph(props) {
  const [isActive, setIsActive] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const jsonTree = props.tree;
  const projectname = props.projectName;
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [file, setFile] = useState("");
  const [table_list, settable_list] = useState([]);

  const [zoomLevel, setZoomLevel] = useState(1);
  /*which tables match query */
  const [matchingQuery, setMatchingQuery] = useState([]);
  /* */
  const [isChecked, setIsChecked] = useState(false);
  /* */
  const [list, setList] = useState([
    { parameter: "", value: "", condition: "" },
  ]);
  /* */
  const [variable_list, set_variable_list] = useState([]);
  const [parameters_list, set_parameters_list] = useState([]);
  const [return_type_list, set_return_type_list] = useState([]);
  const [built_in_function_name_list,set_built_in_function_name_list] = useState([]);

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
  };
  function printtree(names, root) {
    names.add(root.name);
    root.children.forEach((element) => {
      printtree(names, element);
    });
  }
  useEffect(() => {
    const names = new Set();
    printtree(names, jsonTree);
    settable_list(names);
  }, []);

  const handleDropdownClick = () => {
    setIsActive(!isActive);
  };

  function handleCheckboxClick(e) {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
    extract_from_db();
  }
  const handleRemove = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  function handleSelectAll(e) {
    const allOptions = [...table_list];
    setSelectedOptions(
      selectedOptions.length === allOptions.length ? [] : allOptions
    );
    extract_from_db();
  }
  async function extract_from_db() {
    let return_type_list = [];
    let variables_list = [];
    let parameter_list = [];
    let built_in_function_name_list = [];


    for (let name of selectedOptions) {
      const project = `${projectname}_${name}`;
      await Axios.get(
        `http://localhost:3001/api/getreturn?project_name=${project}`
      ).then((response) => {
        return_type_list.push(response.data[0]["return_type"]);
      });
      await Axios.get(
        `http://localhost:3001/api/search_built_in_function?project_name=${name}`
      ).then((response) => {
        for (let index = 0; index < response.data.length - 1; index++) {
          const element = response.data[index]["built_in_function_name"];
          built_in_function_name_list.push(element);
        }
            });
      await Axios.get(
        `http://localhost:3001/api/param_search?project_name=${name}`
      ).then((response) => {
        for (let index = 0; index < response.data.length - 1; index++) {
          const element = response.data[index]["parameter_type"];
          parameter_list.push(element);
        }
      });
      await Axios.get(
        `http://localhost:3001/api/variable_search?project_name=${name}`
      ).then((response) => {
        for (let index = 0; index < response.data.length - 1; index++) {
          const element = response.data[index]["variable_type"];
          variables_list.push(element);
        }
      });
    }
    set_return_type_list(Array.from(new Set(return_type_list)));
    set_built_in_function_name_list(Array.from(new Set(built_in_function_name_list)));
    set_variable_list(Array.from(new Set(variables_list)));
    set_parameters_list(Array.from(new Set(parameter_list)));
  }
  const handleListClick = (e) => {
    e.stopPropagation();
  };

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
  const handleAdd = () => {
    setList([...list, { parameter: "", value: "", condition: "" }]);
  };
  function handleLeave() {
    setIsDialogVisible(false);
  }

  const handleValueChange = (e, index) => {
    const { name, value } = e.target;
    setList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };

  const handleconditionChange = (e, index) => {
    const { name, value } = e.target;
    setList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };

  const handleParameterChange = (e, index) => {
    const { name, value } = e.target;
    setList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };

  const handleoptionchange = (e, index) => {
    const { name, value } = e.target;
    setList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };

  function handleZoom(event) {
    setZoomLevel(event.transform.k);
  }
  useEffect(() => {
    extract_from_db();

  },[selectedOptions])
  function updatecolor(nodeDatum) {
    const color = nodeDatum.nodeDatum.color[0];
    const regex = /[^/]*$/;
    const string = `${nodeDatum.nodeDatum.name} from : ${
      regex.exec(nodeDatum.nodeDatum.file)[0]
    }`;
    if (matchingQuery.includes(nodeDatum.nodeDatum.name)) {
      return (
        <g onClick={() => console.log(nodeDatum)}>
          <circle className="object" fill={color} r="20" />
          <text fill="black" strokeWidth="1" x="30">
            {string}
          </text>
        </g>
      );
    } else {
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

  const handleSubmit = () => {
    if (list.length === 1) {
      list[0].condition = "and";
    }
    list.forEach((item, index) => {
      console.log(item);
    });
  };
  return (
    <>
      <h1>Graph</h1>
      <label style={{ position: "relative", left: "96%", top: "-120px" }}>
        <Switch onChange={handleSwitchChange} checked={isChecked} />
      </label>
      {isChecked && (
        <div>
          <div
            className={`checkbox-dropdown ${isActive ? "is-active" : ""}`}
            onClick={handleDropdownClick}
          >
            select function
            <ul className="checkbox-dropdown-list" onClick={handleListClick}>
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedOptions.length === table_list.length}
                    onChange={handleSelectAll}
                  />
                  all
                </label>
              </li>
              {[...table_list].map((option) => (
                <li key={option} value={option}>
                  <label>
                    <input
                      type="checkbox"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={handleCheckboxClick}
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginLeft: "300px", marginTop: "-50px" }}>
            <div style={{ paddingLeft: "100px" }}>
              {list.map((item, index) => (
                <div key={index} style={{ paddingBottom: "20px" }}>
                  <div
                    style={{ paddingRight: "20px", display: "inline-block" }}
                  >
                    <select
                      name="parameter"
                      value={item.parameter}
                      onChange={(e) => handleParameterChange(e, index)}
                    >
                      <option value="">Choose</option>
                      <option value="if_statements">if statement</option>
                      <option value="while_statements">while statement</option>
                      <option value="return_type">return_type</option>
                      <option value="params">parameters</option>
                      <option value="variables">variable</option>
                      <option value="for">for</option>
                      <option value="builtin">built_in_functions</option>
                    </select>
                  </div>

                  <div
                    style={{ paddingRight: "20px", display: "inline-block" }}
                  >
                    {item.parameter === "params" ? (
                      <div>
                        <select
                          name="value"
                          value={item.value}
                          onChange={(e) => {
                            handleoptionchange(e, index);
                            setSelectedDropdown("params");
                          }}
                        >
                          <option value="">choose</option>

                          {Array.from(parameters_list).map((item, index) => {
                            return (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : item.parameter === "variables" ? (
                      <div>
                        <select
                          name="value"
                          value={item.value}
                          onChange={(e) => {
                            handleoptionchange(e, index);
                            setSelectedDropdown("variables");
                          }}
                        >
                          <option value="">choose</option>

                          {Array.from(variable_list).map((item, index) => {
                            return (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : item.parameter === "return_type" ? (
                      <div>
                        <select
                          name="value"
                          value={item.value}
                          onChange={(e) => {
                            handleoptionchange(e, index);
                            setSelectedDropdown("return_type");
                          }}
                        >
                          <option value="">choose</option>
                          {Array.from(return_type_list).map((item, index) => {
                            return (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : item.parameter === "builtin" ? (
                      <div>
                        <select
                          name="value"
                          value={item.value}
                          onChange={(e) => {
                            handleoptionchange(e, index);
                            setSelectedDropdown("built_in_function_name");
                          }}
                        >
                          <option value="">choose</option>
                          {Array.from(built_in_function_name_list).map((item, index) => {
                            return (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )
                    : (
                      <div>
                        {selectedDropdown === null && (
                          <input
                            name="value"
                            value={item.value}
                            className="inputsearch"
                            onChange={(e) => handleValueChange(e, index)}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {list.length - 1 !== index ? (
                    <div
                      style={{ paddingRight: "20px", display: "inline-block" }}
                    >
                      <select
                        name="condition"
                        value={item.condition}
                        onChange={(e) => handleconditionChange(e, index)}
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
                      className="button-28"
                      onClick={() => handleRemove(index)}
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
              style={{
                marginTop: "20px",
                marginLeft: "100px",
                marginRight: "20px",
              }}
              className="button-28"
              onClick={handleAdd}
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
          </div>
        </div>
      )}

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "100px",
            width: "100%",
            height: "500px",
            paddingTop: "100px",
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
            separation={{ siblings: 1.1, nonSiblings: 1.1 }}
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
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </>
  );
}

export default Graph;
