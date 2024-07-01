const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const { collections, tasks, users } = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "data",
    secret: "nooneknow",
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

  if (obj == 0) {
    console.log("error");
    return res.redirect("/login");
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
      name: obj[0].username,
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

app.get("/", home);
async function home(req, res) {
  const isLogin = req.session.isLogin;
  const userName = req.session.user.name;

  try {
    const getcollections = await collections.findAll({
      include: [
        {
          model: tasks,
          attributes: ["is_done"],
        },
        {
          model: users,
          attributes: ["username"],
        },
      ],
      order: [["id", "DESC"]],
    });

    const collectionsData = getcollections.map((item) => {
      const doneTasks = item.tasks.filter((task) => task.is_done).length;
      const totalTasks = item.tasks.length;
      const allDone = doneTasks === totalTasks && totalTasks == totalTasks;
      const username = item.user.username;

      return {
        ...item.get({ plain: true }),
        doneTasks,
        totalTasks,
        allDone,
        username,
      };
    });
    res.render("index", { obj: collectionsData, isLogin, userName });
    // return res.json(collectionsData);
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

  const { id } = req.params;
  return res.render("add-task", { id });
}
app.post("/add-task", addTask);
async function addTask(req, res) {
  const { id, to_do, is_done } = req.body;
  const v = is_done == "on" ? true : false;
  const query = `INSERT INTO "tasks" (to_do,is_done,collections_id,"createdAt","updatedAt") VALUES ('${to_do}','${v}','${id}',NOW(),NOW()) `;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  res.redirect("/");
}
app.get("/tasks/:id", editView);
async function editView(req, res) {
  const { id } = req.params;
  const idUser = req.session.user.id;
  const getcollid = await collections.findOne({
    where: { user_id: idUser, id: id },
  });
  if (getcollid) {
    try {
      const getcollections = await collections.findOne({
        where: { id: id },
        include: [
          {
            model: tasks,
            attributes: ["is_done", "to_do", "id"],
          },
        ],
      });

      const doneTasks = getcollections.tasks.filter((item) => item.is_done).length;
      const totalTasks = getcollections.tasks.length;
      const unDone = totalTasks - doneTasks;
      const allDone = doneTasks === totalTasks && totalTasks == totalTasks;
      res.render("tasks", { data: getcollections, doneTasks, totalTasks, unDone, allDone });
    } catch (error) {
      console.log(error);
    }
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
    const query = `UPDATE "collections" set name='${name}' WHERE id=${id}`;
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

app.delete("/delete/:id", deleteCollections);
async function deleteCollections(req, res) {
  const { id } = req.params;
  try {
    const getcoll = await collections.findOne({
      where: { id: id },
    });

    await getcoll.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}
app.get("/delete-task/:id", deletetask);
async function deletetask(req, res) {
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
  const { id, to_do, is_done } = req.body;
  const v = is_done == "on" ? true : false;

  const query = `UPDATE "tasks" SET to_do='${to_do}',is_done='${v}' WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.SELECT });

  res.redirect("/");
}

// query 1

app.get("/getCollWithProf", async (req, res) => {
  try {
    const getcoll = await collections.findAll({
      include: [
        {
          model: users,
        },
      ],
    });
    return res.json(getcoll);
  } catch (error) {
    console.log(error);
  }
});

// 2
app.get("/getCollWithTasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getcoll = await collections.findAll({
      where: { id: id },
      include: [
        {
          model: tasks,
        },
      ],
    });
    return res.json(getcoll);
  } catch (error) {
    console.log(error);
  }
});

// 3
app.get("/getAll/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getcoll = await collections.findAll({
      where: { id: id },
      include: [
        {
          model: tasks,
        },
        {
          model: users,
        },
      ],
    });
    return res.json(getcoll);
  } catch (error) {
    console.log(error);
  }
});

// end query
const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
