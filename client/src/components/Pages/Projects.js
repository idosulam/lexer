import React, { useEffect, useState, useRef, createRef } from "react";
import Axios from "axios";
import "../../App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Projects() {
  const [projectsList, setProjects] = useState([]);

  const searchinputref = useRef(null);
  const inputRefs = projectsList.map(() => createRef());
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) => {
      if (response.status === 200) {
        setProjects(response.data);
      }
    });
  }, []);

  function delete_files_project(project) {
    Axios.delete(
      `http://localhost:3001/api/deletefiles/${project.project_name}`
    )
      .then((response) => {
        if (response.status !== 200) {
          toast.error("Failed to delete project", {
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
        toast.error("Failed to delete project", {
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
  }

  function delete_json_project(project) {
    Axios.delete(`http://localhost:3001/api/deletejson/${project.project_name}`)
      .then((response) => {
        if (response.status !== 200) {
          toast.error("Failed to delete project", {
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
        toast.error("Failed to delete project", {
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
  }


  async function delete_tables(project) {
    Axios.get(
      `http://localhost:3001/api/json_search?project_name=${project}`
    ).then(async (response) => {
      if (response.status === 200) {
        const jsonobj = JSON.parse(response.data[0]["json_tree"]);
        const names = new Set();
        printtree(names, jsonobj);

        for (const function_name of names) {
          try {
            const res = await Axios.delete(
              `http://localhost:3001/api/deletetables/${project}_${function_name}`,
              {
              }
            );
    
            if (res.status !== 200) {
              toast.error("Failed to delete project", {
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
            toast.error(error.message, {
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


      }
    });
    
    
  }

  function delete_project(project) {
    Axios.delete(`http://localhost:3001/api/delete/${project.project_name}`)
      .then((response) => {
        if (response.status === 200) {
          delete_files_project(project);
          delete_json_project(project);
          delete_tables(project.project_name)
          toast.success("Project deleted successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          Axios.get("http://localhost:3001/api/get")
            .then((response) => {
              if (response.status === 200) {
                setProjects(response.data);
              }
            })
            .catch((error) => {});
        } else {
          toast.error("Failed to delete project", {
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
        toast.error("Failed to delete project", {
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
  }

  function redirect(project) {
    setTimeout(() => {
      const currentUrl = window.location.origin;
      const newUrl =
        currentUrl +
        "/show?project_name=" +
        encodeURIComponent(project.project_name) +
        "&id=" +
        encodeURIComponent(project.id);
      window.location.href = newUrl;
    }, 500);
  }

  function showlist() {
    if (searchinputref.current.value.length === 0) {
      Axios.get("http://localhost:3001/api/get")
        .then((response) => {
          if (response.status === 200) {
            setProjects(response.data);
          }
        })
        .catch((error) => {});
      return;
    }
    Axios.get(
      `http://localhost:3001/api/search?project_name=${searchinputref.current.value}`
    )
      .then((response) => {
        if (response.status === 200) {
          setProjects(response.data);
        }
      })
      .catch((error) => {});
  }

  function update_json_project(old_name, newname) {
    Axios.put("http://localhost:3001/api/updatejson", {
      old_project_name: old_name,
      project_name: newname,
    }).then((response) => {
      if (response.status !== 200) {
        toast.error("Failed to update project", {
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
    });
  }

  function printtree(names, root) {
    names.add(root.name);
    root.children.forEach((element) => {
      printtree(names, element);
    });
  }

  async function update_tables(project_name, new_name) {
    Axios.get(
      `http://localhost:3001/api/json_search?project_name=${project_name}`
    ).then(async (response) => {
      if (response.status === 200) {
        const jsonobj = JSON.parse(response.data[0]["json_tree"]);
        const names = new Set();
        printtree(names, jsonobj);

        for (const function_name of names) {
          try {
            const res = await Axios.put(
              "http://localhost:3001/api/updatetables",
              {
                old_project_name: `${project_name}_${function_name}`,
                project_name: `${new_name}_${function_name}`,
              }
            );
    
            if (res.status !== 200) {
              toast.error("Failed to insert project", {
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
            toast.error(error.message, {
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


      }
    });
    
    
  }

  function update_files_project(old_name, newname) {
    Axios.put("http://localhost:3001/api/updatefiles", {
      old_project_name: old_name,
      project_name: newname,
    }).then((response) => {
      if (response.status !== 200) {
        toast.error("Failed to update project", {
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
    });
  }
  function update_project(project, projectref) {
    if (projectref.current.value.length === 0) {
      return;
    }
    if (projectref.current.value === project.project_name) {
      return;
    }
    Axios.put("http://localhost:3001/api/update", {
      old_project_name: project.project_name,
      project_name: projectref.current.value,
    })
      .then((response) => {
        update_files_project(project.project_name, projectref.current.value);
        update_json_project(project.project_name, projectref.current.value);
        update_tables(project.project_name, projectref.current.value);
        projectref.current.value = "";
        if (response.status === 200) {
          toast.success("Project updated successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          Axios.get("http://localhost:3001/api/get")
            .then((response) => {
              if (response.status === 200) {
                setProjects(response.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          toast.error("Failed to update project", {
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
        if (error.response.status === 409) {
          toast.error("Name already exist", {
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
          toast.error("Failed to update project", {
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
      });
  }
  function changecursor(e) {
    e.target.style.cursor = "pointer";
  }
  return (
    <div style={{marginTop : '20px'}}>
      <h1 style={{ fontSize: 50, letterSpacing: 2.2 }}>Your Projects</h1>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <input
        id="searchbar"
        type="text"
        ref={searchinputref}
        onChange={showlist}
        name="search"
        placeholder="Search project"
      />
</div>
      {projectsList.length > 0 ? (
        <div className="card-container">
          {projectsList.map((project, index) => (
            <div className="card" key={project.id}>
              <h1
                className="text"
                onMouseEnter={changecursor}
                onClick={() => redirect(project)}
              >
                {project.project_name}
              </h1>
              <h3>{project.id}</h3>
              <button onClick={() => delete_project(project)}>delete</button>
              <input
                type="text"
                className="update_input"
                ref={inputRefs[index]}
              />
              <button
                onClick={() => {
                  update_project(project, inputRefs[index]);
                }}
              >
                update
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects found</p>
      )}
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
  );
}

export default Projects;
