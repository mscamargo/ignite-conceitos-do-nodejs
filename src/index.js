const express = require("express");
const cors = require("cors");

const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "Username not found" });
  }

  request.user = user;

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
  const { todos } = request.user;

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const task = {
    id: uuidV4(),
    title,
    deadline,
    done: false,
    created_at: new Date(),
  };

  request.user.todos.push(task);

  return response.status(201).json(task);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { todos } = request.user;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Task not found" });
  }

  Object.assign(todo, { title, deadline });

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request.user;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Task not found" });
  }

  Object.assign(todo, { done: true });

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request.user;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Task not found" });
  }

  request.user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;
