import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import Axios from "axios";
import { AiFillInfoCircle, AiOutlineClear } from "react-icons/ai";
import "./graph.css";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
function Graph({ tree, projectName, onSetWantedFile }) {
  const [isActive, setIsActive] = useState(false);
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const jsonTree = tree;
  const projectname = projectName;
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [boxdata, setboxdata] = useState(false);
  const [query_from_db, set_query_from_db] = useState([]);
  const [selected_index, set_selected_index] = useState(0);

  const [show_remove_configuration, set_show_remove_configuration] =
    useState(false);

  const [file, setFile] = useState("");
  const [table_list, settable_list] = useState([]);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [matchingQuery, setMatchingQuery] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [list, setList] = useState([
    { parameter: "", value: "", condition: "" },
  ]);
  const [variable_list, set_variable_list] = useState([]);
  const [parameters_list, set_parameters_list] = useState([]);
  const [parameters_modifier_list, set_parameters_modifier_list] = useState([]);

  const [return_type_list, set_return_type_list] = useState([]);
  const [variable_modifier_list, set_variable_modifier_list] = useState([]);

  const [built_in_function_name_list, set_built_in_function_name_list] =
    useState([]);
  const [query_name, setquery_name] = useState("");

  function handle_query_name_change(event) {
    setquery_name(event.target.value);
  }
  const [IspopupOpen, SetIsPopupOpen] = useState(false);

  const open_popup = () => {
    SetIsPopupOpen(true);
  };

  const close_popup = () => {
    SetIsPopupOpen(false);
  };
  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    function printtree(names, root) {
      names.add(root.name);
      root.children.forEach((element) => {
        printtree(names, element);
      });
    }

    const names = new Set();
    printtree(names, jsonTree);
    settable_list(names);
  }, [jsonTree]);

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
    if (value <= -1) return;
    setList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };
  const handle_query_configuration = (e) => {
    const selectedIndex = e.target.selectedIndex - 1;

    if (selectedIndex <= -1) {
      set_show_remove_configuration(false);
      return;
    }
    set_selected_index(selectedIndex);
    set_show_remove_configuration(true);
    setmessage("loading configuration");
    const chosen_query = query_from_db[selectedIndex];
    let new_list = [];
    for (const chosen_query_function of JSON.parse(
      chosen_query.query_functions
    )) {
      const new_function_name = `${chosen_query_function}`;
      new_list.push(new_function_name);
    }
    setSelectedOptions(new_list);
    setList(JSON.parse(chosen_query.query_json));
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
    list[index] = { parameter: e.target.value, value: "", condition: "" };
  };

  const handleoptionchange = (e, index) => {
    const { name, value } = e.target;
    setList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };

  function handle_info_enter(event) {
    if (boxdata === true) {
      setboxdata(false);
      return;
    }
    setDialogPosition({ x: event.clientX, y: event.clientY });
    setboxdata(true);
  }

  function handleZoom(event) {
    setZoomLevel(event.transform.k);
  }
  useEffect(() => {
    async function extract_from_db() {
      if (!message.length) setmessage("updating query search options");
      setloading(true);
      let return_type_list = [];
      let variables_list = [];
      let parameter_list = [];
      let variable_modifiers_list = [];
      let parameter_modifier_list = [];
      let built_in_function_name_list = [];

      for (let name of selectedOptions) {
        const project = `${projectname}_${name}`;
        await Axios.get(
          `http://localhost:3001/api/getreturn?project_name=${project}`
        ).then((response) => {
          return_type_list.push(response.data[0]["return_type"]);
        });
        await Axios.get(
          `http://localhost:3001/api/search_built_in_function?project_name=${projectname}&function_name=${name}`
        ).then((response) => {
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]["built_in_function_name"];
            built_in_function_name_list.push(element);
          }
        });
        await Axios.get(
          `http://localhost:3001/api/param_search?project_name=${projectname}&function_name=${name}`
        ).then((response) => {
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]["parameter_type"];
            parameter_list.push(element);
          }
        });
        await Axios.get(
          `http://localhost:3001/api/param_modifier_search?project_name=${projectname}&function_name=${name}`
        ).then((response) => {
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]["parameter_modifier"];
            parameter_modifier_list.push(element);
          }
        });
        await Axios.get(
          `http://localhost:3001/api/variable_search?project_name=${projectname}&function_name=${name}`
        ).then((response) => {
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]["variable_type"];
            variables_list.push(element);
          }
        });

        await Axios.get(
          `http://localhost:3001/api/variable_modifier_search?project_name=${projectname}&function_name=${name}`
        ).then((response) => {
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index]["variable_modifier"];
            variable_modifiers_list.push(element);
          }
        });
      }
      set_parameters_modifier_list(
        Array.from(new Set(parameter_modifier_list))
      );
      set_variable_modifier_list(Array.from(new Set(variable_modifiers_list)));
      set_return_type_list(Array.from(new Set(return_type_list)));
      set_built_in_function_name_list(
        Array.from(new Set(built_in_function_name_list))
      );
      set_parameters_list(Array.from(new Set(parameter_list)));
      set_variable_list(Array.from(new Set(variables_list)));
      setloading(false);
      setmessage("");
    }
    extract_from_db();
  }, [selectedOptions, projectname, message.length]);

  async function handleclick(function_name, filename) {
    onSetWantedFile(function_name, filename);
  }

  function updatecolor(nodeDatum) {
    const color = nodeDatum.nodeDatum.color[0];
    const regex = /[^/]*$/;
    const string = `${nodeDatum.nodeDatum.name} from : ${
      regex.exec(nodeDatum.nodeDatum.file)[0]
    }`;
    if (matchingQuery.includes(nodeDatum.nodeDatum.name)) {
      return (
        <g
          onClick={() => {
            handleclick(
              nodeDatum.nodeDatum.name,
              regex.exec(nodeDatum.nodeDatum.file)[0]
            );
          }}
        >
          <circle className="object" fill={color} r="20" />
          <text fill="black" strokeWidth="1" x="30">
            {string}
          </text>
        </g>
      );
    } else {
      return (
        <g
          onClick={() => {
            handleclick(
              nodeDatum.nodeDatum.name,
              regex.exec(nodeDatum.nodeDatum.file)[0]
            );
          }}
        >
          <circle fill={color} r="20" />
          <text fill="black" strokeWidth="1" x="30">
            {string}
          </text>
        </g>
      );
    }
  }

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/api/get_query_from_db?project_name=${projectName}`
    ).then((response) => {
      if (response.status === 200) {
        set_query_from_db(response.data);
      }
    });
  }, [set_query_from_db, projectName]);

  async function createquery(list) {
    const promises = [];
    for (let index = 0; index < selectedOptions.length; index++) {
      let query = `SELECT distinct project.${projectname}_${selectedOptions[index]}.function_name\n`;
      query += ` FROM project.${projectname}_${selectedOptions[index]}\n`;
      query += ` LEFT JOIN project.parameters_table ON 
      project.${projectname}_${selectedOptions[index]}.project_name = project.parameters_table.project_name 
        AND project.${projectname}_${selectedOptions[index]}.function_name = parameters_table.function_name
 LEFT JOIN project.variables_table ON 
project.${projectname}_${selectedOptions[index]}.project_name = project.variables_table.project_name 
        AND project.${projectname}_${selectedOptions[index]}.function_name = project.variables_table.function_name 
         LEFT JOIN project.built_in_functions_table ON \n
		project.${projectname}_${selectedOptions[index]}.project_name = project.built_in_functions_table.project_name AND project.${projectname}_${selectedOptions[index]}.function_name = project.built_in_functions_table.function_name\n WHERE `;

      for (let i = 0; i < list.length; i++) {
        const field = list[i];
        switch (field.parameter) {
          case "variables":
            query += ` (SELECT COUNT(*) FROM project.variables_table WHERE project.variables_table.variable_type = '${field.value}' AND project.variables_table.function_name = '${selectedOptions[index]}' AND project.variables_table.project_name = '${projectname}') >= 1\n ${field.condition}`;
            break;
          case "variables_modifiers":
            query += ` (SELECT COUNT(*) FROM project.variables_table WHERE project.variables_table.variable_modifier = '${field.value}' AND project.variables_table.function_name = '${selectedOptions[index]}' AND project.variables_table.project_name = '${projectname}') >= 1\n ${field.condition}`;
            break;
          case "params_modifier":
            query += ` (SELECT COUNT(*) FROM project.parameters_table WHERE project.parameters_table.parameter_modifier = '${field.value}' AND project.parameters_table.function_name = '${selectedOptions[index]}' AND project.parameters_table.project_name = '${projectname}') >= 1\n ${field.condition}`;

            break;
          case "params":
            query += ` (SELECT COUNT(*) FROM project.parameters_table WHERE project.parameters_table.parameter_type = '${field.value}' AND project.parameters_table.function_name = '${selectedOptions[index]}' AND project.parameters_table.project_name = '${projectname}') >= 1\n ${field.condition}`;
            break;
          case "builtin":
            query += ` (SELECT COUNT(*) FROM project.built_in_functions_table WHERE project.built_in_functions_table.built_in_function_name = '${field.value}' AND project.built_in_functions_table.function_name = '${selectedOptions[index]}' AND project.built_in_functions_table.project_name = '${projectname}') >= 1\n ${field.condition}`;
            break;
          default:
            query += ` project.${projectname}_${selectedOptions[index]}.${field.parameter} = '${field.value}'\n ${field.condition}`;
            break;
        }
      }

      query = query.slice(0, -3);
      promises.push(
        Axios.get(
          `http://localhost:3001/api/check_table?sql_query=${query}`
        ).then(async (response) => {
          if (response.status === 200) {
            if (response.data[0] !== undefined)
              return response.data[0].function_name;
          }
        })
      );
    }
    const match = await Promise.all(promises);
    setMatchingQuery(match.filter((item) => item !== undefined));
  }
  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const field = list[i];
      if (list.length - 1 === i) {
        field.condition = "and";
      }
      if (!field.value || !field.parameter || !field.condition) return;
    }
    createquery(list);
    reloadquery();
  };
  const reloadquery = () => {
    Axios.get(
      `http://localhost:3001/api/get_query_from_db?project_name=${projectName}`
    ).then((response) => {
      if (response.status === 200) {
        set_query_from_db(response.data);
      }
    });
  };

  const handlepopupSubmit = (event) => {
    close_popup();

    if (!query_name || query_name.length === 0) {
      return;
    }

    savequery(selectedOptions, list);
  };

  async function savequery(checked_functions, list) {
    reloadquery();

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/insert_query",
        {
          query_name: query_name,
          query_checked_functions: checked_functions,
          querylist: list,
          projectName: projectName,
        }
      );
      if (response.status === 200) {
        toast.success("query saved successfully ", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("query name already exist", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.log(error);

        toast.error("Failed to save query", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
    reloadquery();
  }
  const handle_Remove_Configuration = () => {
    Axios.delete(
      `http://localhost:3001/api/deletequery/${query_from_db[selected_index].id}`
    )
      .then((response) => {
        if (response.status === 200) {
          toast.success("Query deleted successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          reloadquery();
        } else {
          toast.error("Failed to delete query", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete query", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const handlequerysave = () => {
    if (selectedOptions.length === 0) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const field = list[i];
      if (list.length - 1 === i) {
        field.condition = "and";
      }
      if (!field.value || !field.parameter || !field.condition) return;
    }
    open_popup();
  };

  return (
    <>
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
      <label
        className="button"
        style={{ position: "relative", left: "96%", top: "-4px" }}
      >
        <input
          id="toggle"
          type="checkbox"
          onChange={handleSwitchChange}
          checked={isChecked}
        />
        <span className="slider"></span>
      </label>
      <label
        style={{ position: "relative", marginLeft: "60px", cursor: "pointer" }}
        onClick={handle_info_enter}
      >
        <AiFillInfoCircle
          style={{ color: "white", height: "40px", width: "50px" }}
        />
      </label>
      <label
        style={{ position: "relative", marginLeft: "80px", cursor: "pointer" }}
        onClick={() => setMatchingQuery([])}
      >
        <AiOutlineClear
          style={{ color: "white", height: "40px", width: "50px" }}
        />
      </label>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "100px",
            width: "100%",
            height: "871px",
            backgroundColor: "#fff",
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
              stroke-width: 3px;
              stroke: #333;
              stroke-opacity:0.8 ;

              transition: stroke-width 0.3s ease-in-out, stroke 0.3s ease-in-out;
            }
            
            .important-link:hover {
              stroke-width: 6px;
              stroke: #000000;
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

        {boxdata && (
          <div className="popup-info">
            {matchingQuery.length ? (
              matchingQuery.map((query_matched, index) => (
                <pre key={index}>
                  <code style={{ fontFamily: "jost", color: "#fff" }}>
                    {`  ${index + 1}. `}
                  </code>
                  <code style={{ fontFamily: "jost", color: "#fff" }}>
                    {query_matched}
                  </code>
                </pre>
              ))
            ) : (
              <code style={{ fontFamily: "jost", color: "#fff" }}>
                No Functions Found
              </code>
            )}
          </div>
        )}

        {isChecked && (
          <div className="popup-info-search">
            <div
              style={{ fontFamily: "jost", marginLeft: "150px" }}
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
                      style={{ fontFamily: "jost" }}
                    />
                    all
                  </label>
                </li>
                {[...table_list].map((option) => (
                  <li
                    key={option}
                    value={option}
                    style={{ fontFamily: "jost" }}
                  >
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
                        style={{ fontFamily: "jost" }}
                      >
                        <option value="">Choose</option>
                        <option value="if_statements">if statement</option>
                        <option value="while_statements">
                          while statement
                        </option>
                        <option value="return_type">return_type</option>
                        <option value="params">parameters</option>
                        <option value="variables">variable</option>
                        <option value="params_modifier">
                          parameters modifiers
                        </option>
                        <option value="variables_modifiers">
                          variable modifiers
                        </option>
                        <option value="for_statements">for</option>
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
                            }}
                            style={{ fontFamily: "jost" }}
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
                            style={{ fontFamily: "jost" }}
                            name="value"
                            value={item.value}
                            onChange={(e) => {
                              handleoptionchange(e, index);
                            }}
                          >
                            <option value="">choose</option>

                            {Array.from(variable_list).map((item, index) => {
                              return (
                                <option
                                  value={item}
                                  key={index}
                                  style={{ fontFamily: "jost" }}
                                >
                                  {item}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : item.parameter === "return_type" ? (
                        <div>
                          <select
                            style={{ fontFamily: "jost" }}
                            name="value"
                            value={item.value}
                            onChange={(e) => {
                              handleoptionchange(e, index);
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
                            style={{ fontFamily: "jost" }}
                            name="value"
                            value={item.value}
                            onChange={(e) => {
                              handleoptionchange(e, index);
                            }}
                          >
                            <option value="">choose</option>
                            {Array.from(built_in_function_name_list).map(
                              (item, index) => {
                                return (
                                  <option value={item} key={index}>
                                    {item}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </div>
                      ) : item.parameter === "params_modifier" ? (
                        <div>
                          <select
                            style={{ fontFamily: "jost" }}
                            name="value"
                            value={item.value}
                            onChange={(e) => {
                              handleoptionchange(e, index);
                            }}
                          >
                            <option value="">choose</option>
                            {Array.from(parameters_modifier_list).map(
                              (item, index) => {
                                return (
                                  <option value={item} key={index}>
                                    {item}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </div>
                      ) : item.parameter === "variables_modifiers" ? (
                        <div>
                          <select
                            style={{ fontFamily: "jost" }}
                            name="value"
                            value={item.value}
                            onChange={(e) => {
                              handleoptionchange(e, index);
                            }}
                          >
                            <option value="">choose</option>
                            {Array.from(variable_modifier_list).map(
                              (item, index) => {
                                return (
                                  <option value={item} key={index}>
                                    {item}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </div>
                      ) : (
                        <div>
                          {(item.parameter !== "builtin") |
                            "return_type" |
                            "variables" |
                            "params" && (
                            <div className="inputbox">
                              <input
                                style={{ fontFamily: "jost" }}
                                required
                                type="number"
                                min={0}
                                name="value"
                                value={item.value}
                                onChange={(e) => handleValueChange(e, index)}
                              />
                              <span style={{ fontFamily: "jost" }}>
                                Enter Value
                              </span>
                              <i></i>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {list.length - 1 !== index ? (
                      <div
                        style={{
                          paddingRight: "20px",
                          display: "inline-block",
                        }}
                      >
                        <select
                          name="condition"
                          value={item.condition}
                          onChange={(e) => handleconditionChange(e, index)}
                          style={{ fontFamily: "jost" }}
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
                        style={{ fontFamily: "jost" }}
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
                  fontFamily: "jost",
                }}
                className="button-28"
                onClick={handleAdd}
              >
                Add
              </button>
              <button
                style={{ marginTop: "20px", fontFamily: "jost" }}
                className="button-28"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                style={{
                  marginTop: "20px",
                  fontFamily: "jost",
                  marginLeft: "1.5rem",
                }}
                className="button-28"
                onClick={handlequerysave}
              >
                save_query
              </button>

              <select
                style={{ marginLeft: "1.5rem" }}
                onChange={(e) => handle_query_configuration(e)}
              >
                <option value="">choose search configartion</option>

                {query_from_db.map((item, index) => (
                  <option value={item.query_name} key={index}>
                    {item.query_name}
                  </option>
                ))}
              </select>
            </div>
            {show_remove_configuration && (
              <button
                className="button-28"
                onClick={() => handle_Remove_Configuration()}
                style={{
                  fontFamily: "jost",
                  marginLeft: "46rem",
                  width: "18rem",
                  marginTop: "1.5rem",
                }}
              >
                remove_configuration
              </button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="outPopUp">
          <div className="gearbox">
            <div className="overlay"></div>
            <div className="gear one">
              <div className="gear-inner">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
            <div className="gear two">
              <div className="gear-inner">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
            <div className="gear three">
              <div className="gear-inner">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
            <div className="gear four large">
              <div className="gear-inner">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          </div>
          <p style={{ font: "jost", color: "white" }}>{message}</p>
        </div>
      )}

      {IspopupOpen && (
        <div className="popup-container">
          <div className="popup">
            <a className="closePopUp" onClick={close_popup}>
              X
            </a>
            <input
              type="text"
              value={query_name}
              onChange={handle_query_name_change}
              placeholder="Enter query name"
            />
            <button onClick={handlepopupSubmit}>Submit</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Graph;
