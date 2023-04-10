import React, { useState } from "react";
import FileUpload from "../../components/File-Upload/file-upload.component";
import "../../App.css";
import Axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: [],
  });

  function handleRedirect() {
    /*
    setTimeout(() => {
      const currentUrl = window.location.href;
      const newUrl = currentUrl + "projects";
      window.location.href = newUrl;
    }, 4000);
    */
  }

  const updateUploadedFiles = (files) =>
    setNewUserInfo({ ...newUserInfo, profileImages: files });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const sendAPI = async (files) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file,file.name);
      Axios.post("http://localhost:5000/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.status !== 200) {
          console.log(res);
        }
      });
    }
    try {
      const response = await Axios.get("http://localhost:5000/tree");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const recv_data = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/get-data");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const upload_json_tree = (name, tree) => {
    Axios.post("http://localhost:3001/api/uploadjson", {
      project_name: name,
      json_tree: tree,
    });
  };

  async function upload_data_list(data_list, name) {
    for (const element of data_list) {
      try {
        const response = await Axios.post(
          "http://localhost:3001/api/datainsert",
          {
            projectName: name,
            function_name: element.function_name,
            identifier_instance_dict: element.identifier_instance_dict,
            identifier_type_dict: element.identifier_type_dict,
            if_statements: element.if_statements,
            while_statements: element.while_statements,
            inside_file: element.inside_file,
            return_type: element.return_type,
          }
        );

        if (response.status !== 200) {
          toast.error("failed to upload project", {
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
   
      for (let i = 0; i < element.built_in_function.length - 1; i++) {
        const response = await Axios.post(
          "http://localhost:3001/api/insert_built_in_function",
          {
            project_name: name,
            function_name: element.function_name,
            built_in_function: element.built_in_function[i],
          }
        );
        if (response.status !== 200) {
          toast.error("failed to upload project", {
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
      for (let i = 0; i < element.params.length - 1; i++) {
        const response = await Axios.post(
          "http://localhost:3001/api/insert_parameter",
          {
            project_name: name,
            function_name: element.function_name,
            parameter_modifier: element.params[i].modifier,
            parameter_type : element.params[i].type.trim(),
            parameter_name : element.params[i].identifier,
              }
        );
        if (response.status !== 200) {
          toast.error("failed to upload project", {
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

      for (let i = 0; i < element.variables.length - 1; i++) {
        const response = await Axios.post(
          "http://localhost:3001/api/insert_variable",
          {
            project_name: name,
            function_name: element.function_name,
            variable_modifier: element.variables[i].modifier,
            variable_type : element.variables[i].type.trim(),
            variable_name : element.variables[i].identifier,
          }
        );
        if (response.status !== 200) {
          toast.error("failed to upload project", {
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
  }

  const upload_files_to_database = async (name, files) => {
    const json_tree = await sendAPI(files);
    const data_list = await recv_data();
    upload_data_list(data_list, name);
    upload_json_tree(name, json_tree);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function () {
        Axios.post("http://localhost:3001/api/fileinsert", {
          project_name: name,
          file: reader.result,
          file_name: file.name,
          
        }
        )
          .then((response) => {
            if (response.statusCode === 400) {
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
          })
          .catch((error) => {
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
          });
      };
      reader.readAsText(file);
    }
    handleRedirect();
  };

  const sendToDatabase = (name, files) => {
    Axios.post("http://localhost:3001/api/insert", {
      project_name: name,
    })
      .then((response) => {
        if (response.status === 200) {
          upload_files_to_database(name, files);
          toast.success("Project inserted successfully redirecting...", {
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
          console.log(error);
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
      });
  };

  function handleButtonClick() {
    
    if (newUserInfo.profileImages.length <= 0) {
      toast.error("No files uploaded to project", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const projectName = prompt("Please enter a project name:");
    if (!projectName || projectName.length === 0) {
      return;
    }
    sendToDatabase(projectName, newUserInfo.profileImages);
  }

  return (
    <div className="background">
      <form
        onSubmit={handleSubmit}
        multiple={true}
        style={{ paddingTop: "20px" }}
      >
        <FileUpload multiple updateFilesCb={updateUploadedFiles} />
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className="button-28" onClick={handleButtonClick}>
          Submit
        </button>
      </div>
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

export default Home;
