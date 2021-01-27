let todos = [];
let navState = 'all';

// 서버 통신 using async/await
const async = (() => {
    return {
      async get(url, cb) {
        try {
        const response = await fetch(url);
        const data = await response.json();
        const todos = await cb(data);
        render(todos);
        } catch (err) {
          console.error(err);
        }
      },
  
      async post(url, cb, payload) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          const data = await response.json();
          const todos = await cb(data);
          render(todos);
        } catch (err) {
          console.error(err);
        }
      },
  
      async patch(url, cb, payload) {
        try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          const data = await response.json();
          const todos = await cb(data);
          render(todos);
        } catch (err) {
          console.error(err);
        }
      },
  
      async delete(url, cb) {
        try {
          const response = await fetch(url, {
            method: 'DELETE'
          })
          const data = await response.json();
          const todos = await cb(data);
          render(todos);
        } catch (err) {
          console.error(err);
        }
      },
    }
})();

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

const fetchTodos = () => {
  const cb = data => todos = [...data].sort((todo1, todo2) => todo2.id - todo1.id);

  async.get('/todos', cb);
};

const addTodo = (() => {
  const generateId = () => todos.length ? Math.max(...(todos.map(todo => todo.id))) + 1 : 1;

  return content => {
    const cb = data => todos = [data, ...todos];
    const payload = { id: generateId(), content, completed: false };

    async.post('/todos', cb, payload);
  }
})();

const checkToggle = id => {
  const todo = todos.find(todo => todo.id === id);
  const cb = data => todos = todos.map(todo => todo.id === data.id ? data : todo);
  const payload = { ...todo, completed: !todo.completed };

  async.patch(`/todos/${id}`, cb, payload);
};

const checkAllToggle = checked => {
  todos = todos.map(todo => ({ ...todo, completed: checked }));
  const cb = data => todos = todos.map(todo => ({ ...todo, data }));
  const payload = { completed: checked };

  todos.forEach(todo => {
    async.patch(`/todos/${todo.id}`, cb, payload);
  })
};

const removeTodo = id => {
  const cb = () => todos = todos.filter(todo => todo.id !== id);

  async.delete(`/todos/${id}`, cb);
};

const removeAllCompleted = () => {
  const completedTodos = todos.filter(todo => todo.completed);
  const cb = () => todos = todos.filter(todo => !todo.completed);

  completedTodos.forEach(todo => {
    async.delete(`/todos/${todo.id}`, cb);
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

$nav.onclick = e => navToggle(e.target);