import React, { useState } from "react";
import FileUpload from "../../components/File-Upload/file-upload.component";
import "./Home.css";
import Axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { animateScroll as scrollAnimate } from 'react-scroll';

function Home() {
  const [loading, setloading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: [],
  });
  const refresh = () =>
    {setTimeout(function () {
      window.location.reload();
    }, 2000);}

  function handleRedirect() {
    setIsChecked(true);
    setTimeout(() => {
      const currentUrl = window.location.href;
      const newUrl = currentUrl + "projects";
      window.location.href = newUrl;
    }, 1500);

  }

  const updateUploadedFiles = (files) =>{
    setNewUserInfo({ ...newUserInfo, profileImages: files });
    setTimeout(() => {
      scrollToButton();

    },500)

  }

  const scrollToButton = () => {
    scrollAnimate.scrollToBottom({
      duration: 1000,
      smooth: 'smooth',
      offset: -100
    });
  }
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const sendAPI = async (files) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      Axios.post("http://localhost:5000/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.status !== 200) {
          toast.error(res, {
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
    try {
      const response = await Axios.get("http://localhost:5000/tree");
      return response.data;
    } catch (error) {
      console.error(error);
      setloading(false);
      refresh();
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
  };

  const recv_data = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/get-data");
      return response.data;
    } catch (error) {
      console.error(error);
      setloading(false);
      refresh();
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
            return_type: element.return_type.trim(),
            for_statements: element.for_statements,
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
          setloading(false);
          refresh();
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
        setloading(false);
        refresh();
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
            parameter_type: element.params[i].type.trim(),
            parameter_name: element.params[i].identifier,
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
          setloading(false);
          refresh();
        }
      }

      for (let i = 0; i < element.variables.length - 1; i++) {
        const response = await Axios.post(
          "http://localhost:3001/api/insert_variable",
          {
            project_name: name,
            function_name: element.function_name,
            variable_modifier: element.variables[i].modifier,
            variable_type: element.variables[i].type.trim(),
            variable_name: element.variables[i].identifier,
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
          setloading(false);
          refresh();
        }
      }
    }
  }

  const sendToDatabase = async (name, files) => {
    try {
      const response = await Axios.post("http://localhost:3001/api/insert", {
        project_name: name,
      });
      if (response.status === 200) {
        const json_tree = await sendAPI(files);
        const data_list = await recv_data();
        await Promise.all([
          upload_data_list(data_list, name),
          upload_json_tree(name, json_tree),
        ]);
        await Promise.all(
          files.map(async (file) => {
            const fileContent = await readFileAsText(file);
            await Axios.post("http://localhost:3001/api/fileinsert", {
              project_name: name,
              file: fileContent,
              file_name: file.name,
            });
          })
        );
        handleRedirect();
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
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setloading(false);
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
        setloading(false);
        refresh();
      } else {
        console.log(error);
        setloading(false);
        refresh();

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
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
        setloading(false);
        refresh();
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
      };
      reader.readAsText(file);
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
    setloading(true);
    sendToDatabase(projectName, newUserInfo.profileImages);
  }

  return (
    <div className="background">
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
      {loading && (
        <div className="outPopUp">
          <input
            className="label_input"
            type="checkbox"
            id="check"
            checked={isChecked}
          />
          <label className="label_loading" htmlFor="check">
            <div className="check-icon"></div>
          </label>
        </div>
      )}
      {!loading && (
        <div>
          <form onSubmit={handleSubmit} multiple={true}>
            <FileUpload multiple updateFilesCb={updateUploadedFiles} />
          </form>
          <div className="submit-button-background">
            {newUserInfo.profileImages.length > 0 && (

              <div className="light-button">
              <button className="bt"  onClick={handleButtonClick}>
                  <div className="light-holder">
                      <div className="dot"></div>
                      <div className="light"></div>
                  </div>
                  <div className="button-holder">
                      
                      <p>submit</p>
                  </div>
              </button>
          </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Home;
