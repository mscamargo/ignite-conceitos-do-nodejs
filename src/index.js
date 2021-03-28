const express = require("express");
const cors = require("cors");

const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const usernameAlreadyInUse = users.some((user) => user.username === username);

  if (usernameAlreadyInUse) {
    return response.status(400).json({ error: "username already in use" });
  }

  const user = {
    id: uuidV4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const { todos } = users.find((user) => user.username === username);

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const task = {
    id: uuidV4(),
    title,
    deadline,
    done: false,
    created_at: new Date(),
  };

  const user = users.find((user) => user.username === username);

  user.todos.push(task);

  return response.status(201).json(task);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
