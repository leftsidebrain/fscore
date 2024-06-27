const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));
const { Sequelize, QueryTypes, json } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const { type } = require("os");

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "data",
    secret: "rahasiabgtcui",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/register", registerView);
function registerView(req, res) {
  res.render("register");
}

app.post("/register", register);
async function register(req, res) {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      req.flash("danger", "Register Failed : Password failde to be encyptionsss!");
      return res.redirect("/register");
    }

    const query = `INSERT INTO "users"(email,username,password,"createdAt","updatedAt") VALUES ('${email}','${name}','${hash}',now(),now())`;
    await sequelize.query(query, { type: QueryTypes.INSERT });
    res.redirect("/login");
  });
}

app.get("/login", loginView);
function loginView(req, res) {
  res.render("login");
}
app.post("/login", login);
async function login(req, res) {
  const { email, password } = req.body;
  const query = `SELECT * FROM "users" WHERE "email" = '${email}'`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!obj) {
    console.log("error");
  }
  bcrypt.compare(password, obj[0].password, (err, result) => {
    if (err) {
      return res.redirect("/login");
    }

    if (result == false) {
      return res.redirect("/login");
    }

    req.session.isLogin = true;
    req.session.user = {
      id: obj[0].id,
    };
    res.redirect("/");
  });
}

function isAuthenticated(req, res, next) {
  if (req.session.isLogin) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", isAuthenticated, home);
async function home(req, res) {
  try {
    const isLogin = req.session.isLogin;
    const query = `SELECT * FROM "collections"`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log("🚀 ~ home ~ obj:", obj);
    res.render("index", { obj, isLogin });
  } catch (error) {
    console.log(error);
  }
}

app.get("/add-collection", colectionView);
function colectionView(req, res) {
  res.render("add-collection");
}

app.post("/add-collection", addColection);
async function addColection(req, res) {
  try {
    const id_user = req.session.user.id;
    const { name } = req.body;

    const query = `INSERT INTO "collections" (name,user_id,"createdAt","updatedAt") VALUES ('${name}','${id_user}',NOW(),NOW())`;
    await sequelize.query(query, { type: QueryTypes.SELECT });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

app.get("/add-task/:id", addTaskView);
async function addTaskView(req, res) {
  const userId = req.session.user.id;
  const query = `SELECT * FROM collections WHERE user_id = ${userId}`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log("🚀 ~ addTaskView ~ obj:", obj);
  if (obj.length == 0) {
    return res.redirect("/");
  } else if (userId == obj[0].user_id) {
    const { id } = req.params;
    return res.render("add-task", { id });
  } else {
    console.log("Akses Dibatasi");
    res.redirect("/");
  }
}
app.post("/add-task", addTask);
async function addTask(req, res) {
  const { id, to_do, is_done } = req.body;
  const v = is_done == "on" ? true : false;
  const query = `INSERT INTO "tasks" (to_do,is_done,collections_id,"createdAt","updatedAt") VALUES ('${to_do}','${v}','${id}',NOW(),NOW()) `;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("/");
}
app.get("/edit-task/:id", editView);
async function editView(req, res) {
  const user_id = req.session.user.id;
  const { id } = req.params;
  const query = ` SELECT * FROM "collections" WHERE id =${id}`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  if (user_id == obj[0].user_id) {
    const query = `SELECT "collections".name,"tasks".* FROM "collections"
    RIGHT JOIN "tasks" ON "collections".id = "tasks".collections_id
    WHERE "collections".id = ${id} ORDER BY "collections".id DESC`;
    const query2 = `SELECT name,id FROM "collections" WHERE id = ${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const obj2 = await sequelize.query(query2, { type: QueryTypes.SELECT });
    res.render("edit-task", { data: obj, data2: obj2[0] });
  } else {
    res.redirect("/");
  }
}

app.get("/task", taskView);
function taskView(req, res) {
  res.render("task");
}
app.get("/edit-collections/:id", editColView);
async function editColView(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM "collections" WHERE id =${id}`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("edit-collection", { data: obj[0] });
}
app.post("/edit-collections", editCol);
async function editCol(req, res) {
  try {
    const { id, name } = req.body;
    const userId = req.session.user.id;
    const query = `UPDATE "collections" set name='${name}',user_id='${userId}',"createdAt"=NOW(),"updatedAt"=NOW() WHERE id=${id}`;
    await sequelize.query(query, { type: QueryTypes.UPDATE });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}
app.get("/logout", logout);
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
}

app.get("/delete/:id", deleteCollections);
async function deleteCollections(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM "collections" WHERE id=${id}`;
  const query2 = `DELETE FROM "tasks" WHERE collections_id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });
  await sequelize.query(query2, { type: QueryTypes.DELETE });

  res.redirect("/");
}
app.get("/delete-task/:id", deleteCollections);
async function deleteCollections(req, res) {
  const { id } = req.params;
  const query = `DELETE FROM "tasks" WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });
  res.redirect("/");
}

app.get("/edit-todo/:id", todoView);
async function todoView(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM "tasks" WHERE id =${id}`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log("🚀 ~ todoView ~ obj:", obj);
  res.render("edit-todo", { data: obj[0], id });
}

app.post("/edit-todo", updateTodo);
async function updateTodo(req, res) {
  const { id, to_do, collections_id, is_done } = req.body;
  const v = is_done == "on" ? true : false;

  const query = `UPDATE "tasks" SET to_do='${to_do}',is_done='${v}',collections_id='${collections_id}',"createdAt"=NOW(),"updatedAt"=NOW() WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.SELECT });

  res.redirect("/");
}

const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
