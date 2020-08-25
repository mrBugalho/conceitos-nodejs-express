const express = require("express");
const cors = require("cors");
//const { uuid } = require("uuidv4");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "Project not found."})
  }

  const {title, url, techs} = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  

  //tenho certeza que likes será igual a zero e não foi passado pelo cliente.
  //repository.likes = 0;

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex( repository=> repository.id === id);

  repositories.splice(repositoryIndex, 1);

  if( repositoryIndex < 0) {
    return response.status(400).json({error: "Project not found."});
  }

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  //Localizar o repositório pelo id recebido.
  const repository = repositories.find( repository => repository.id === id);
  

  if(repository == undefined){
    return response.status(400).send();
  }

  //Aumento o numero de likes.
  repository.likes += 1; 

  return response.json(repository);
});

module.exports = app;
