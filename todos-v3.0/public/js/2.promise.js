let todos = [];
let navState = 'all';

// DOM nodes
const $todoList = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all');
const $clearCompleted = document.querySelector('.clear-completed');
const $completedCount = document.querySelector('.completed-todos');
const $activeCount = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');

const render = () => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  
  let todosNav = navState === 'all' ? todos : navState === 'active' ? activeTodos : completedTodos;
  
  const $fragment = document.createDocumentFragment();

  $todoList.textContent = '';
  todosNav.forEach(({ id, content, completed }) => {
    const $li = document.createElement('li');
    $li.setAttribute('id', id);
    $li.setAttribute('class', 'todo-item');

    const $input = document.createElement('input');
    $input.setAttribute('id', `ck-${id}`);
    $input.setAttribute('class', 'checkbox');
    $input.setAttribute('type', 'checkbox');
    if (completed) $input.setAttribute('checked', 'checked');
    else $input.removeAttribute('checked');

    const $label = document.createElement('label');
    $label.setAttribute('for', `ck-${id}`);
    const $textNode = document.createTextNode(content);
    $label.appendChild($textNode);

    const $i = document.createElement('i');
    $i.setAttribute('class', 'remove-todo far fa-times-circle');

    $li.appendChild($input);
    $li.appendChild($label);
    $li.appendChild($i);
    $fragment.appendChild($li);
  })
  $todoList.appendChild($fragment);

  $completedCount.textContent = completedTodos.length;
  $activeCount.textContent = activeTodos.length;

  $completeAll.firstElementChild.checked = completedTodos.length === todos.length;

  if (!todos.length) $completeAll.firstElementChild.checked = false;
};

// 서버 통신 using promise
const promise = ((method, url, payload) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    if (method !== 'GET') xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(new Error(xhr.status));
      }
    }
  })
})

const fetchTodos = () => {
  promise('GET', '/todos')
  .then(data => todos = [...data].sort((todo1, todo2) => todo2.id - todo1.id))
  .then(() => render())
  .catch(e => console.error(e));
};

const addTodo = (() => {
  const generateId = () => todos.length ? Math.max(...(todos.map(todo => todo.id))) + 1 : 1;
  
  return content => {
    const payload = { id: generateId(), content, completed: false };

    promise('POST', '/todos', payload)
    .then(data => todos = [data, ...todos])
    .then(() => render())
    .catch(e => console.error(e)); 
  }
})();

const checkToggle = id => {
  const todo = todos.find(todo => todo.id === id);
  const payload = { ...todo, completed: !todo.completed };

  promise('PATCH', `/todos/${id}`, payload)
  .then(data => todos = todos.map(todo => todo.id === data.id ? data : todo))
  .then(() => render())
  .catch(e => console.error(e)); 
};

const checkAllToggle = checked => {
  todos = todos.map(todo => ({ ...todo, completed: checked }));

  todos.forEach(todo => {
    promise('PATCH', `/todos/${todo.id}`, { completed: checked })
    .then(data => todos = todos.map(todo => ({ ...todo, data })))
    .then(() => render())
    .catch(e => console.error(e)); 
  })
};

const removeTodo = id => {
  promise('DELETE', `/todos/${id}`)
  .then(() => todos = todos.filter(todo => todo.id !== id))
  .then(() => render())
  .catch(e => console.error(e)); 
};

const removeAllCompleted = () => {
  const completedTodos = todos.filter(todo => todo.completed);

  completedTodos.forEach(todo => {
    promise('DELETE', `/todos/${todo.id}`)
      .then(() => todos = todos.filter(todo => !todo.completed))
      .then(() => render())
      .catch(e => console.error(e));
  })
};

const navToggle = target => {
  [...$nav.children].forEach(nav => nav.classList.toggle('active', nav === target));
  navState = target.id;
  render();
};

document.addEventListener('DOMContentLoaded', fetchTodos);

$inputTodo.onkeyup = e => {
  const content = e.target.value
  if (e.key !== 'Enter' || content === '') return;

  addTodo(content);
  e.target.value = '';
};

$todoList.onchange = e => checkToggle(+e.target.parentNode.id);

$completeAll.onchange = e => checkAllToggle(e.target.checked);

$todoList.onclick = e => {
  if (!e.target.matches('.todos > li > .remove-todo')) return;

  removeTodo(+e.target.parentNode.id);
};

$clearCompleted.onclick = () => removeAllCompleted();

$nav.onclick = e => navToggle(e.target)