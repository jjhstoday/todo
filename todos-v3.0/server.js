const express = require('express');

const app = express();

let todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'Javascript', completed: false }
];

app.use(express.static('public'));
app.use(express.json()); // for parsing application/json

// app.get('/', (req, res) => {
//   res.send('hello world!');
// });

app.get('/todos', (req, res) => {
  todos.sort((t1, t2) => t2.id - t1.id);
  res.send(todos);
  // res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.post('/todos', (req, res) => {
  console.log(req.body);
  todos = [req.body, ...todos];
  res.send(todos);
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  todos = todos.map(todo => (todo.id === +id ? { ...todo, completed } : todo));

  res.send(todos);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== +id);

  res.send(todos);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
