const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ido123321231@',
    database: 'project',
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/get',(req, res) => {
    const sqlget = "select * from project.project_table";
db.query(sqlget,(err,result)=>{
res.send(result);
});
});




app.post('/api/insert', (req, res) => {
    const projectName = req.body.project_name;
    const sqlInsert = "INSERT INTO project.project_table (project_name) VALUES (?);";
    db.query(sqlInsert, [projectName], (err, result) => {
        if (err) {
            if (err.errno === 1062){
                res.status(409).send({ error: "Enter new project name" });
            }
            else {
                console.log(err);
            res.status(400).send({ error: "Failed to insert project" });
            }
        } else {
            res.status(200).send({ message: "Project inserted successfully" });
        }
    });
});

app.post('/api/uploadjson', (req, res) => {
    const projectName = req.body.project_name;
    const json_tree = JSON.stringify(req.body.json_tree)
    const sqlInsert = "INSERT INTO project.json_table (project_name,json_tree) VALUES (?,?);";
    db.query(sqlInsert, [projectName,json_tree], (err, result) => {
        if (err) {
                console.log(err);
            res.status(400).send({ error: "Failed to insert project" });
            
        } else {
            res.status(200).send({ message: "Project inserted successfully" });
        }
    });
});





app.post('/api/fileinsert',  (req, res) => {
        const projectName = req.body.project_name;
        const file = req.body.file;
        const file_name = req.body.file_name;
        const sqlInsert = "INSERT INTO project.files_table (project_name, file,file_name) VALUES (?,?,?);";
         db.query(sqlInsert, [projectName, file,file_name], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to insert project" });
        } else {
            res.status(200).send({ message: "Project inserted successfully" });
        }
    });
    
});



app.get('/api/search',(req, res) => {
    const search_project = req.query.project_name;
    const sqlsearch = "select * from project.project_table WHERE project_name like ?";
db.query(sqlsearch,[`%${search_project}%`],(err,result)=>{
res.send(result);
});
});


app.get('/api/file_search', (req, res) => {
    const project_name = req.query.project_name;
    const sqlsearch = "select * from project.files_table WHERE project_name = ?";
    db.query(sqlsearch, [project_name], (err, result) => {
      if (err) {
        res.send({ error: 'Error executing the query' });
      } else {
        res.send(result);
      }
    });
  });
  app.get('/api/json_search', (req, res) => {
    const project_name = req.query.project_name;
    const sqlsearch = "select * from project.json_table WHERE project_name = ?";
    db.query(sqlsearch, [project_name], (err, result) => {
      if (err) {
        res.send({ error: 'Error executing the query' });
      } else {
        res.send(result);
      }
    });
  });

app.delete('/api/delete/:project_name', (req, res) => {
    const project_name = req.params.project_name;
    const sqldelete = "DELETE FROM project.project_table WHERE project_name = (?);";
    db.query(sqldelete, [project_name], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to delete project" });
        }
        else {
            res.status(200).send({ message: "Project delete successfully" });

        }
    });
});


app.delete('/api/deletefiles/:project_name', (req, res) => {
    const project_name = req.params.project_name;
    const sqldelete = "DELETE FROM project.files_table WHERE project_name = (?);";
    db.query(sqldelete, [project_name], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to delete project" });
        }
        else {
            res.status(200).send({ message: "Project delete successfully" });

        }
    });
});

app.delete('/api/deletejson/:project_name', (req, res) => {
    const project_name = req.params.project_name;
    const sqldelete = "DELETE FROM project.json_table WHERE project_name = (?);";
    db.query(sqldelete, [project_name], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to delete project" });
        }
        else {
            res.status(200).send({ message: "Project delete successfully" });

        }
    });
});


app.put('/api/updatefiles', (req, res) => {
    const project_name = req.body.project_name; 
    const old_project_name = req.body.old_project_name;
    const sqlupdate = "UPDATE project.files_table SET project_name = (?) WHERE project_name = (?);";
    db.query(sqlupdate, [project_name,old_project_name  ], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to update project" });
        }
        else {
            res.status(200).send({ message: "Project updatec successfully" });
        }
    });
});

app.put('/api/updatejson', (req, res) => {
    const project_name = req.body.project_name; 
    const old_project_name = req.body.old_project_name;
    const sqlupdate = "UPDATE project.json_table SET project_name = (?) WHERE project_name = (?);";
    db.query(sqlupdate, [project_name,old_project_name  ], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to update project" });
        }
        else {
            res.status(200).send({ message: "Project updatec successfully" });
        }
    });
});



app.put('/api/update', (req, res) => {
    const project_name = req.body.project_name;
    const old_project_name = req.body.old_project_name;
    const sqlupdate = "UPDATE project.project_table SET project_name = (?) WHERE project_name = (?);";
    db.query(sqlupdate, [project_name,old_project_name  ], (err, result) => {
        if (err) {
            if (err.errno === 1062){
                res.status(409).send({ error: "Enter new project name" });
            }
            else {
                console.log(err);
            res.status(400).send({ error: "Failed to update project" });
        }
    }
        else {
            res.status(200).send({ message: "Project update successfully" });
        }
    });
});

app.listen(3001, () => {
    console.log("Server listening on port 3001");
});