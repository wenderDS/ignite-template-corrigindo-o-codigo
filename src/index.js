const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  
  if (repositoryIndex < 0) {
    return response.status(404).json({ 
      error: "Repository not found" 
    });
  }

  if (title) {
    repositories[repositoryIndex].title = title;
  }

  if (techs) {
    repositories[repositoryIndex].techs = techs;
  }

  if (url) {
    repositories[repositoryIndex].url = url;
  }

  return response.status(201).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  const likes = repositories[repositoryIndex].likes;

  return response.status(201).json({ likes });
});

module.exports = app;
