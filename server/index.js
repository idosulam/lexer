const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Ido123321231@",
  database: "project",
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/datainsert", (req, res) => {
  const projectName = req.body.projectName;
  function_name = req.body.function_name;
  identifier_instance_dict = JSON.stringify(req.body.identifier_instance_dict);
  identifier_type_dict = JSON.stringify(req.body.identifier_type_dict);
  if_statements = req.body.if_statements;
  while_statements = req.body.while_statements;
  inside_file = req.body.inside_file;
  params = JSON.stringify(req.body.params);
  return_type = req.body.return_type;
  variables = JSON.stringify(req.body.variables);

  const table_name = `${projectName}_${function_name}`;
  db.query(
    `CREATE TABLE project.${table_name} (
    id INT NOT NULL AUTO_INCREMENT,
    project_name VARCHAR(200) ,
    function_name VARCHAR(200) ,
    identifier_instance_dict JSON ,
    identifier_type_dict JSON ,
    if_statements INT ,
    while_statements INT ,
    inside_file LONGTEXT ,
    return_type VARCHAR(255) ,
    PRIMARY KEY (id));`,
    (error) => {
      if (error) {
        console.log(error);
        res.status(500).send("Failed to create table");
        return;
      }
      const sqlInsert = `INSERT INTO project.${table_name} (project_name,function_name,identifier_instance_dict,identifier_type_dict,if_statements,while_statements,inside_file,return_type) VALUES(?,?,?,?,?,?,?,?);`;
      db.query(
        sqlInsert,
        [
          projectName,
          function_name,
          identifier_instance_dict,
          identifier_type_dict,
          if_statements,
          while_statements,
          inside_file,
          return_type,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).send({ error: "Failed to insert project" });
          } else {
            res.status(200).send({ message: "Project inserted successfully" });
          }
        }
      );
    }
  );
});

app.get("/api/get", (req, res) => {
  const sqlget = "select * from project.project_table";
  db.query(sqlget, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const projectName = req.body.project_name;
  const sqlInsert =
    "INSERT INTO project.project_table (project_name) VALUES (?);";
  db.query(sqlInsert, [projectName], (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        res.status(409).send({ error: "Enter new project name" });
      } else {
        console.log(err);
        res.status(400).send({ error: "Failed to insert project" });
      }
    } else {
      res.status(200).send({ message: "Project inserted successfully" });
    }
  });
});

app.post("/api/uploadjson", (req, res) => {
  const projectName = req.body.project_name;
  const json_tree = JSON.stringify(req.body.json_tree);
  const sqlInsert =
    "INSERT INTO project.json_table (project_name,json_tree) VALUES (?,?);";
  db.query(sqlInsert, [projectName, json_tree], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to insert project" });
    } else {
      res.status(200).send({ message: "Project inserted successfully" });
    }
  });
});

app.post("/api/fileinsert", (req, res) => {
  const projectName = req.body.project_name;
  const file = req.body.file;
  const file_name = req.body.file_name;
  const sqlInsert =
    "INSERT INTO project.files_table (project_name, file,file_name) VALUES (?,?,?);";
  db.query(sqlInsert, [projectName, file, file_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to insert project" });
    } else {
      res.status(200).send({ message: "Project inserted successfully" });
    }
  });
});

app.get("/api/search", (req, res) => {
  const search_project = req.query.project_name;
  const sqlsearch =
    "select * from project.project_table WHERE project_name like ?";
  db.query(sqlsearch, [`%${search_project}%`], (err, result) => {
    res.send(result);
  });
});

app.get("/api/file_search", (req, res) => {
  const project_name = req.query.project_name;
  const sqlsearch = "select * from project.files_table WHERE project_name = ?";
  db.query(sqlsearch, [project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});

app.get("/api/json_search", (req, res) => {
  const project_name = req.query.project_name;
  const sqlsearch = "select * from project.json_table WHERE project_name = ?";
  db.query(sqlsearch, [project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});

app.delete("/api/delete/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete =
    "DELETE FROM project.project_table WHERE project_name = (?);";
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.delete("/api/deletefiles/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = "DELETE FROM project.files_table WHERE project_name = (?);";
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.delete("/api/deletejson/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = "DELETE FROM project.json_table WHERE project_name = (?);";
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.put("/api/updatefiles", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate =
    "UPDATE project.files_table SET project_name = (?) WHERE project_name = (?);";
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/updatejson", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate =
    "UPDATE project.json_table SET project_name = (?) WHERE project_name = (?);";
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/update", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate =
    "UPDATE project.project_table SET project_name = (?) WHERE project_name = (?);";
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        res.status(409).send({ error: "Enter new project name" });
      } else {
        console.log(err);
        res.status(400).send({ error: "Failed to update project" });
      }
    } else {
      res.status(200).send({ message: "Project update successfully" });
    }
  });
});

app.put("/api/updatetables", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqltable = `ALTER TABLE project.${old_project_name} RENAME project.${project_name};`;
  db.query(sqltable, [], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project update successfully" });
    }
  });
});

app.delete("/api/deletetables/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DROP TABLE project.${project_name};`;
  db.query(sqldelete, [], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.get("/api/getreturn", (req, res) => {
  const table_name = req.query.project_name;
  const sqlsearch = `select return_type from project.${table_name}`;

  db.query(sqlsearch, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.status(200).json(result);
  });
});

app.get("/api/check_table", (req, res) => {
  const sql_query = req.query.sql_query;

  db.query(sql_query, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.status(200).json(result);
  });
});

app.post("/api/insert_parameter", (req, res) => {
  const projectName = req.body.project_name;
  const function_name = req.body.function_name;

  const parameter_modifier = req.body.parameter_modifier;
  const parameter_type = req.body.parameter_type;
  const parameter_name = req.body.parameter_name;
  const sqlInsert =
    "INSERT INTO project.parameters (project_name,function_name ,parameter_modifier,parameter_type,parameter_name) VALUES (?,?,?,?,?);";

  db.query(
    sqlInsert,
    [projectName, function_name, parameter_modifier,parameter_type,parameter_name],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send({ error: "Failed to insert project" });
      } else {
        res.status(200).send({ message: "Project inserted successfully" });
      }
    }
  );
});

app.post("/api/insert_built_in_function", (req, res) => {
  const projectName = req.body.project_name;
  const function_name = req.body.function_name;
  const built_in_function = req.body.built_in_function;

  const sqlInsert =
    "INSERT INTO project.built_in_functions (project_name,function_name ,built_in_function_name) VALUES (?, ?,?);";
  db.query(
    sqlInsert,
    [projectName, function_name, built_in_function],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send({ error: "Failed to insert project" });
      } else {
        res.status(200).send({ message: "Project inserted successfully" });
      }
    }
  );
});

app.post("/api/insert_variable", (req, res) => {
  const projectName = req.body.project_name;
  const function_name = req.body.function_name;
  const variable_modifier = req.body.variable_modifier;
  const variable_type = req.body.variable_type;
  const variable_name = req.body.variable_name;

  const sqlInsert =
    "INSERT INTO project.variables (project_name,function_name ,variable_modifier,variable_type,variable_name) VALUES (?,?,?,?,?);";
  db.query(sqlInsert, [projectName, function_name, variable_modifier,variable_type,variable_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to insert project" });
    } else {
      res.status(200).send({ message: "Project inserted successfully" });
    }
  });
});

app.delete("/api/delete_parameters/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = "DELETE FROM project.parameters WHERE project_name = (?);";
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.delete("/api/delete_variables/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = "DELETE FROM project.variables WHERE project_name = (?);";
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});
app.put("/api/updatevariables", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate =
    "UPDATE project.variables SET project_name = (?) WHERE project_name = (?);";
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/updateparameters", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate =
    "UPDATE project.parameters SET project_name = (?) WHERE project_name = (?);";
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/update_built_in_function", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate =
    "UPDATE project.built_in_functions SET project_name = (?) WHERE project_name = (?);";
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.delete("/api/delete_built_in_function/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete =
    "DELETE FROM project.built_in_functions WHERE project_name = (?);";
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});



app.get("/api/param_search", (req, res) => {
  const project_name = req.query.project_name;
    const function_name = req.query.function_name;
  const sqlsearch = "select parameter_type from project.parameters WHERE function_name = ? and project_name = ?";
  db.query(sqlsearch, [function_name,project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});


app.get("/api/variable_search", (req, res) => {
  const project_name = req.query.project_name;
  const function_name = req.query.function_name;
  const sqlsearch = "select variable_type from project.variables WHERE function_name = ? and project_name = ?";
  db.query(sqlsearch, [function_name,project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});



app.get("/api/search_built_in_function", (req, res) => {
  const project_name = req.query.project_name;
  const function_name = req.query.function_name;

  const sqlsearch = "select built_in_function_name from project.built_in_functions WHERE function_name = ? and project_name = ? ";
  db.query(sqlsearch, [function_name,project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});



app.listen(3001, () => {
  console.log("Server listening on port 3001");
});

//grep -R cacheRoot /home/vivek/
