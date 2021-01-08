const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const DbService = require('./dbServer');
const { response, request } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/insert', (request, response) => {
  const db = DbService.getDbServiceInstance();

  const { name } = request.body;
  const result = db.insertNewName(name);

  result.then((data) => response.json(data)).catch((err) => console.log(err));
});

app.get('/getAll', (request, response) => {
  const db = DbService.getDbServiceInstance();
  const result = db.getAllData();
  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.patch('/update/:id', (request, response) => {
  const db = DbService.getDbServiceInstance();
  const { id, name } = request.body;
  const result = db.updateById(id, name);
  result.then((data) => response.json(data).catch((err) => console.log(err)));
});

app.delete('/delete/:id', (request, response) => {
  const db = DbService.getDbServiceInstance();
  const { id } = request.params;
  const result = db.deleteById(id);
  result.then((data) => response.json(data)).catch((err) => console.log(err));
});

app.get('/search/:name', (req, res) => {
  const db = DbService.getDbServiceInstance();
  const { name } = req.params;

  const result = db.searchByValue(name);
  result.then((data) => res.json(data)).catch((err) => console.log(err));
});

app.get('/', (req, res) => {
  res.send('hello world ');
});

app.listen(process.env.PORT, () => {
  // app.listen(3001, () => {
  console.log('APP IS RUNNING');
});
