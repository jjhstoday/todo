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

const fetchTodos = () => {
  //TODO: 서버로부터 데이터 취득 예정
  todos = [
    { id: 1, content: 'HTML', completed: false },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'Javascript', completed: false },
  ];

  todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);
  render();
};

const addTodo = (() => {
  const generateId = () => todos.length ? Math.max(...(todos.map(todo => todo.id))) + 1 : 1;
  
  return content => {
    todos = [{ id: generateId(), content, completed: false }, ...todos];
    render();
  }
})();

const checkToggle = id => {
  todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  render();
};

const checkAllToggle = checked => {
  todos = todos.map(todo => ({ ...todo, completed: checked }));
  render();
};

const removeTodo = id => {
  todos = todos.filter(todo => todo.id !== id);
  render();
};

const removeAllCompleted = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
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