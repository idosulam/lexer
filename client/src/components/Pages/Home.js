import React, { useState } from "react";
import FileUpload from "../../components/File-Upload/file-upload.component";
import '../../App.css'
import Axios from 'axios'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: []
  });

  function handleRedirect() {
    setTimeout(() => {
      const currentUrl = window.location.href;
      const newUrl = currentUrl + 'projects';
      window.location.href = newUrl;
    }, 2000);
  }

  const updateUploadedFiles = (files) =>
    setNewUserInfo({ ...newUserInfo, profileImages: files });

  const handleSubmit = (event) => {
    event.preventDefault();
  };


  const sendAPI =async (files) => {
    for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    Axios.post("http://localhost:5000/upload-file", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (res.status !== 200) {
      console.log(res);
      }
    })
   }
   try {
    const response = await Axios.get("http://localhost:5000/tree");
    return response.data;
  } catch (error) {
    console.error(error);
  }
  }

const recv_data =async () => {
   
   try {
    const response = await Axios.get("http://localhost:5000/get-data");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
  }

  const upload_json_tree =(name,tree) => {
    Axios.post('http://localhost:3001/api/uploadjson', {
      project_name: name,
     json_tree : tree,
    })
  }

  const upload_files_to_database = async (name, files) => {
    const json_tree =  await sendAPI(files);
    const data_list =  await recv_data();
    upload_data_list(data_list, name)
    upload_json_tree(name,json_tree);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function () {
        Axios.post('http://localhost:3001/api/fileinsert', {
          project_name: name,
          file: reader.result,
          file_name: file.name,
        }).then((response) => {
          if (response.statusCode === 400) {
            toast.error('Failed to insert project', {
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
        }).catch((error) => {
          toast.error('Failed to insert project', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });;
      };
      reader.readAsText(file);
    }
  };


  const sendToDatabase = (name, files) => {

    Axios.post('http://localhost:3001/api/insert', {
      project_name: name,
    }).then((response) => {
      if (response.status === 200) {
        upload_files_to_database(name, files);
        toast.success('Project inserted successfully redirecting...', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        handleRedirect();
      } 
    }).catch((error) => {
      if (error.response.status === 409){
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
      }
       else{
        console.log(error);
      toast.error('Failed to insert project', {
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
      toast.error('No files uploaded to project', {
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
      <form onSubmit={handleSubmit} multiple={true}>
        <FileUpload
          multiple
          updateFilesCb={updateUploadedFiles}
        />
      </form>
      <button className="button-28" onClick={handleButtonClick}>Submit</button>
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