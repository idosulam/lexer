const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const ansis = require("ansis");
require("dotenv").config();

ansis.extend({
  orange: "#FFAB40",
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function initTable(table_name) {
  switch (table_name) {
    case process.env.PROJECT_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name} (
        id INT NOT NULL AUTO_INCREMENT,
        project_name VARCHAR(100) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX project_name_UNIQUE (project_name ASC) VISIBLE);
      `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    case process.env.JSON_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name} (
          id INT NOT NULL AUTO_INCREMENT,
          project_name VARCHAR(100) NOT NULL,
          json_tree JSON NOT NULL,
          PRIMARY KEY (id),
          UNIQUE INDEX project_name_UNIQUE (project_name ASC) VISIBLE);
      `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    case process.env.FILES_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name} (
          id INT NOT NULL AUTO_INCREMENT,
          project_name VARCHAR(100) NOT NULL,
          file LONGTEXT NOT NULL,
          file_name VARCHAR(45) NOT NULL,
          PRIMARY KEY (id));
      `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    case process.env.VARIABLES_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name}(
          id INT NOT NULL AUTO_INCREMENT,
          project_name VARCHAR(100) NOT NULL,
          function_name VARCHAR(100) NOT NULL,
          variable_modifier VARCHAR(100) ,
          variable_type VARCHAR(100) NOT NULL,
          variable_name VARCHAR(100) NOT NULL,
          PRIMARY KEY (id));
        
      `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    case process.env.PARAMETERS_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name}(
          id INT NOT NULL AUTO_INCREMENT,
          project_name VARCHAR(100) NOT NULL,
          function_name VARCHAR(100) NOT NULL,
          parameter_modifier VARCHAR(100) NOT NULL,
          parameter_type VARCHAR(100) NOT NULL,
          parameter_name VARCHAR(100) NOT NULL,
          PRIMARY KEY (id));
      `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    case process.env.BUILT_IN_FUNCTIONS_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name}(
          id INT NOT NULL AUTO_INCREMENT,
          project_name VARCHAR(100) NOT NULL,
          function_name VARCHAR(100) NOT NULL,
          built_in_function_name VARCHAR(100) NOT NULL,
          PRIMARY KEY (id));
        `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    case process.env.QUERY_HISTORY_TABLE:
      db.query(
        `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name}(
            id INT NOT NULL AUTO_INCREMENT,
            query_project_name VARCHAR(100) NOT NULL,
            query_name VARCHAR(100) NOT NULL,
            query_json JSON NOT NULL,
            query_functions JSON NOT NULL,
            PRIMARY KEY (id));          
          `,
        (err, result) => {
          if (err) {
            if (err.errno === 1050) {
              console.log(
                ansis.orange(
                  `Failed to create ${table_name} at ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")} already exists\n`
                )
              );
            } else {
              console.log(ansis.red(`${err.message}\n`));
            }
          } else {
            console.log(
              ansis.green(
                `created ${table_name} At ${new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}\n`
              )
            );
          }
        }
      );
      break;
    default:
      console.log(table_name);
  }
}

app.post("/api/datainsert", (req, res) => {
  const projectName = req.body.projectName;
  function_name = req.body.function_name;
  identifier_instance_dict = JSON.stringify(req.body.identifier_instance_dict);
  identifier_type_dict = JSON.stringify(req.body.identifier_type_dict);
  if_statements = req.body.if_statements;
  while_statements = req.body.while_statements;
  for_statements = req.body.for_statements;
  inside_file = req.body.inside_file;
  params = JSON.stringify(req.body.params);
  return_type = req.body.return_type;
  variables = JSON.stringify(req.body.variables);

  const table_name = `${projectName}_${function_name}`;
  db.query(
    `CREATE TABLE ${process.env.DB_DATABASE_NAME}.${table_name} (
    id INT NOT NULL AUTO_INCREMENT,
    project_name VARCHAR(200) ,
    function_name VARCHAR(200) ,
    identifier_instance_dict JSON ,
    identifier_type_dict JSON ,
    if_statements INT ,
    while_statements INT ,
    for_statements INT ,
    inside_file LONGTEXT ,
    return_type VARCHAR(255) ,
    PRIMARY KEY (id));`,
    (error) => {
      if (error) {
        console.log(ansis.orange(error));
        res.status(500).send("Failed to create table");
        return;
      }
      const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${table_name} (project_name,function_name,identifier_instance_dict,identifier_type_dict,if_statements,while_statements,for_statements,inside_file,return_type) VALUES(?,?,?,?,?,?,?,?,?);`;
      db.query(
        sqlInsert,
        [
          projectName,
          function_name,
          identifier_instance_dict,
          identifier_type_dict,
          if_statements,
          while_statements,
          for_statements,
          inside_file,
          return_type,
        ],
        (err, result) => {
          if (err) {
            console.log(ansis.orange(err.errno));
            res
              .status(400)
              .send({ error: "Failed to insert create function table" });
          } else {
            res.status(200).send({ message: "Project inserted successfully" });
          }
        }
      );
    }
  );
});

app.get("/api/get", (req, res) => {
  const sqlget = `select * from ${process.env.DB_DATABASE_NAME}.${process.env.PROJECT_TABLE}`;
  db.query(sqlget, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const projectName = req.body.project_name;
  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.PROJECT_TABLE} (project_name) VALUES (?);`;
  db.query(sqlInsert, [projectName], (err, result) => {
    if (err) {
      if (err === 1062) {
        res.status(409).send({ error: "Enter new project name" });
      } else {
        console.log(ansis.orange(err.errno));
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
  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.JSON_TABLE} (project_name,json_tree) VALUES (?,?);`;
  db.query(sqlInsert, [projectName, json_tree], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to insert json tree" });
    } else {
      res.status(200).send({ message: "Project inserted successfully" });
    }
  });
});

app.post("/api/fileinsert", (req, res) => {
  const projectName = req.body.project_name;
  const file = req.body.file;
  const file_name = req.body.file_name;
  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.FILES_TABLE} (project_name, file,file_name) VALUES (?,?,?);`;
  db.query(sqlInsert, [projectName, file, file_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to insert file" });
    } else {
      res.status(200).send({ message: "Project inserted successfully" });
    }
  });
});

app.get("/api/search", (req, res) => {
  const search_project = req.query.project_name;
  const sqlsearch = `select * from ${process.env.DB_DATABASE_NAME}.${process.env.PROJECT_TABLE} WHERE project_name like ?`;
  db.query(sqlsearch, [`%${search_project}%`], (err, result) => {
    res.send(result);
  });
});

app.get("/api/file_search", (req, res) => {
  const project_name = req.query.project_name;
  const sqlsearch = `select * from ${process.env.DB_DATABASE_NAME}.${process.env.FILES_TABLE} WHERE project_name = ?`;
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
  const sqlsearch = `select * from ${process.env.DB_DATABASE_NAME}.${process.env.JSON_TABLE} WHERE project_name = ?`;
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
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.PROJECT_TABLE} WHERE project_name = (?);`;
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.delete("/api/deletefiles/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.FILES_TABLE} WHERE project_name = (?);`;
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.delete("/api/deletejson/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.JSON_TABLE} WHERE project_name = (?);`;
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.put("/api/updatefiles", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate = `UPDATE ${process.env.DB_DATABASE_NAME}.${process.env.FILES_TABLE} SET project_name = (?) WHERE project_name = (?);`;
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/updatejson", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate = `UPDATE ${process.env.DB_DATABASE_NAME}.${process.env.JSON_TABLE} SET project_name = (?) WHERE project_name = (?);`;
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/update", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate = `UPDATE ${process.env.DB_DATABASE_NAME}.${process.env.PROJECT_TABLE} SET project_name = (?) WHERE project_name = (?);`;
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      if (err === 1062) {
        res.status(409).send({ error: "Enter new project name" });
      } else {
        console.log(ansis.orange(err.errno));
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
  const sqltable = `ALTER TABLE ${process.env.DB_DATABASE_NAME}.${old_project_name} RENAME ${process.env.DB_DATABASE_NAME}.${project_name};`;
  db.query(sqltable, [], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project update successfully" });
    }
  });
});

app.delete("/api/deletetables/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DROP TABLE ${process.env.DB_DATABASE_NAME}.${project_name};`;
  db.query(sqldelete, [], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.get("/api/getreturn", (req, res) => {
  const table_name = req.query.project_name;
  const sqlsearch = `select return_type from ${process.env.DB_DATABASE_NAME}.${table_name}`;

  db.query(sqlsearch, (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
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
      console.log(ansis.orange(err.errno));
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
  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.PARAMETERS_TABLE} (project_name,function_name ,parameter_modifier,parameter_type,parameter_name) VALUES (?,?,?,?,?);`;
  db.query(
    sqlInsert,
    [
      projectName,
      function_name,
      parameter_modifier,
      parameter_type,
      parameter_name,
    ],
    (err, result) => {
      if (err) {
        console.log(ansis.orange(err.errno));
        res.status(400).send({ error: "Failed to insert parameters" });
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

  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.BUILT_IN_FUNCTIONS_TABLE} (project_name,function_name ,built_in_function_name) VALUES (?, ?,?);`;
  db.query(
    sqlInsert,
    [projectName, function_name, built_in_function],
    (err, result) => {
      if (err) {
        console.log(ansis.orange(err.errno));
        res.status(400).send({ error: "Failed to insert functions" });
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

  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.VARIABLES_TABLE} (project_name,function_name ,variable_modifier,variable_type,variable_name) VALUES (?,?,?,?,?);`;
  db.query(
    sqlInsert,
    [
      projectName,
      function_name,
      variable_modifier,
      variable_type,
      variable_name,
    ],
    (err, result) => {
      if (err) {
        console.log(ansis.orange(err.errno));
        res.status(400).send({ error: "Failed to insert variables" });
      } else {
        res.status(200).send({ message: "Project inserted successfully" });
      }
    }
  );
});

app.delete("/api/delete_parameters/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.PARAMETERS_TABLE} WHERE project_name = (?);`;
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.delete("/api/delete_variables/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.VARIABLES_TABLE} WHERE project_name = (?);`;
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});
app.put("/api/updatevariables", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate = `UPDATE ${process.env.DB_DATABASE_NAME}.${process.env.VARIABLES_TABLE} SET project_name = (?) WHERE project_name = (?);`;
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/updateparameters", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate = `UPDATE ${process.env.DB_DATABASE_NAME}.${process.env.PARAMETERS_TABLE} SET project_name = (?) WHERE project_name = (?);`;
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.put("/api/update_built_in_function", (req, res) => {
  const project_name = req.body.project_name;
  const old_project_name = req.body.old_project_name;
  const sqlupdate = `UPDATE ${process.env.DB_DATABASE_NAME}.${process.env.BUILT_IN_FUNCTIONS_TABLE} SET project_name = (?) WHERE project_name = (?);`;
  db.query(sqlupdate, [project_name, old_project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to update project" });
    } else {
      res.status(200).send({ message: "Project updatec successfully" });
    }
  });
});

app.delete("/api/delete_built_in_function/:project_name", (req, res) => {
  const project_name = req.params.project_name;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.BUILT_IN_FUNCTIONS_TABLE} WHERE project_name = (?);`;
  db.query(sqldelete, [project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete project" });
    } else {
      res.status(200).send({ message: "Project delete successfully" });
    }
  });
});

app.get("/api/param_search", (req, res) => {
  const project_name = req.query.project_name;
  const function_name = req.query.function_name;
  const sqlsearch = `select parameter_type from ${process.env.DB_DATABASE_NAME}.${process.env.PARAMETERS_TABLE} WHERE function_name = ? and project_name = ?`;
  db.query(sqlsearch, [function_name, project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});

app.get("/api/param_modifier_search", (req, res) => {
  const project_name = req.query.project_name;
  const function_name = req.query.function_name;
  const sqlsearch = `select parameter_modifier from ${process.env.DB_DATABASE_NAME}.${process.env.PARAMETERS_TABLE} WHERE function_name = ? and project_name = ? and parameter_modifier <> 'none'`;
  db.query(sqlsearch, [function_name, project_name], (err, result) => {
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
  const sqlsearch = `select variable_type from ${process.env.DB_DATABASE_NAME}.${process.env.VARIABLES_TABLE} WHERE function_name = ? and project_name = ?`;
  db.query(sqlsearch, [function_name, project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});

app.get("/api/search_file_show", (req, res) => {
  const project_name = req.query.project_name;
  const file_name = req.query.file_name;
  const sqlsearch = `select file from ${process.env.DB_DATABASE_NAME}.${process.env.FILES_TABLE} WHERE file_name = '${file_name}' and project_name = '${project_name}'`;
  db.query(sqlsearch, [], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});

app.get("/api/variable_modifier_search", (req, res) => {
  const project_name = req.query.project_name;
  const function_name = req.query.function_name;
  const sqlsearch = `select variable_modifier from ${process.env.DB_DATABASE_NAME}.${process.env.VARIABLES_TABLE} WHERE function_name = ? and project_name = ? and variable_modifier <> ''`;
  db.query(sqlsearch, [function_name, project_name], (err, result) => {
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

  const sqlsearch = `select built_in_function_name from ${process.env.DB_DATABASE_NAME}.${process.env.BUILT_IN_FUNCTIONS_TABLE} WHERE function_name = ? and project_name = ? `;
  db.query(sqlsearch, [function_name, project_name], (err, result) => {
    if (err) {
      res.send({ error: "Error executing the query" });
    } else {
      res.send(result);
    }
  });
});

app.post("/api/insert_query", (req, res) => {
  const query_name = req.body.query_name;
  const query_checked_functions = JSON.stringify(
    req.body.query_checked_functions
  );
  const querylist = JSON.stringify(req.body.querylist);
  const projectName = req.body.projectName;

  const sqlInsert = `INSERT INTO ${process.env.DB_DATABASE_NAME}.${process.env.QUERY_HISTORY_TABLE} (query_project_name,query_name,query_json,query_functions) VALUES (?,?,?,?);`;

  db.query(
    sqlInsert,
    [projectName, query_name, querylist, query_checked_functions],
    (err, result) => {
      if (err) {
        if (err === 1062) {
          res.status(409).send({ error: "Enter new query name" });
        } else {
          console.log(ansis.orange(err.errno));
          res.status(400).send({ error: "Failed to insert query" });
        }
      } else {
        res.status(200).send({ message: "Project inserted successfully" });
      }
    }
  );
});

app.get("/api/get_query_from_db", (req, res) => {
  const search_query_project = req.query.project_name;
  const sqlsearch = `select * from ${process.env.DB_DATABASE_NAME}.${process.env.QUERY_HISTORY_TABLE} WHERE query_project_name like ?`;
  db.query(sqlsearch, [`%${search_query_project}%`], (err, result) => {
    res.send(result);
  });
});

app.delete("/api/deletequery/:query_id", (req, res) => {
  const query_id = req.params.query_id;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.QUERY_HISTORY_TABLE} WHERE id = ?;`;
  db.query(sqldelete, [query_id], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete query" });
    } else {
      res.status(200).send({ message: "Query deleted successfully" });
    }
  });
});

app.delete("/api/deletequeryname/:query_project_name", (req, res) => {
  const query_project_name = req.params.query_project_name;
  const sqldelete = `DELETE FROM ${process.env.DB_DATABASE_NAME}.${process.env.QUERY_HISTORY_TABLE} WHERE query_project_name = ?;`;
  db.query(sqldelete, [query_project_name], (err, result) => {
    if (err) {
      console.log(ansis.orange(err.errno));
      res.status(400).send({ error: "Failed to delete query" });
    } else {
      res.status(200).send({ message: "Query deleted successfully" });
    }
  });
});

db.connect(async (err) => {
  if (err) {
    console.log(ansis.orange(err.errno));
  } else {
    console.log(ansis.blue("Database connected successfully\n"));
    app.listen(3001, () => {
      console.log(ansis.blue("Server listening on port 3001\n"));
    });
    await initTable(process.env.PROJECT_TABLE);
    await initTable(process.env.JSON_TABLE);
    await initTable(process.env.FILES_TABLE);
    await initTable(process.env.PARAMETERS_TABLE);
    await initTable(process.env.QUERY_HISTORY_TABLE);
    await initTable(process.env.VARIABLES_TABLE);
    await initTable(process.env.BUILT_IN_FUNCTIONS_TABLE);
  }
});
