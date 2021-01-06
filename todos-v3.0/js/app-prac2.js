let todos = [];
let todosNav;

// DOM nodes
const $todoList = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $toggleAll = document.querySelector('.checkbox');
const $clearCompleted = document.querySelector('.btn');
const $completed = document.querySelector('.completed-todos');
const $active = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');
const $allNav = document.getElementById('all');
const $activeNav = document.getElementById('active');

const render = () => {
  if ($allNav.classList.contains('active')) todosNav = todos;
  else if ($activeNav.classList.contains('active')) todosNav = todos.filter(todo => !todo.completed)
  else todosNav = todos.filter(todo => todo.completed);

  // 서버 데이터 HTML 구조 렌더링
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

  // Clear completed <=> items left 카운팅
  $completed.textContent = todos.filter(todo => todo.completed).length;
  $active.textContent = todos.filter(todo => !todo.completed).length;

  // toggleTodo 상태에 따른 toggleAll 상태 변화
  if (todos.map(todo => todo.completed ? 1 : 0).includes(0)) $toggleAll.checked = false;
  else $toggleAll.checked = true;

  if (!todos.length) $toggleAll.checked = false;
};

const fetchTodos = () => {
  // TODO: 서버로 부터 데이터 취득
  todos = [
    { id: 1, content: 'HTML', completed: false },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'Javascript', completed: false },
  ];

  // todos id 숫자 기준 내림차순 정렬
  todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);

  render();
};

const addTodo = (() => {
  const generateId = () => todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  
  return content => {
    todos = [{ id: generateId(), content, completed: false }, ...todos];

    render();
  };
})();

const toggleTodo = id => {
  todos = todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo);
  render();
};

const toggleAll = checked => {
  todos = todos.map(todo => ({...todo, completed: checked}));
  render();
};

const removeTodo = id => {
  todos = todos.filter(todo => todo.id !== id)
  render();
};

const clearCompleted = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
};

const toggleNav = target => {
  [...$nav.children].forEach(nav => nav.classList.toggle('active', nav === target));
  render();
};

// 서버 데이터 취득 후 로딩
document.addEventListener('DOMContentLoaded', fetchTodos);

$inputTodo.onkeyup = e => {
  const content = e.target.value;

  if (e.key !== 'Enter' || !content) return;

  addTodo(content);
  e.target.value = '';
};

$todoList.onchange = e => toggleTodo(+e.target.parentNode.id);

$toggleAll.onchange = e => toggleAll(e.target.checked);

$todoList.onclick = e => {
  if (!e.target.matches('.todos > li > i')) return;

  removeTodo(+e.target.parentNode.id);
};

$clearCompleted.onclick = () => clearCompleted();

$nav.onclick = e => toggleNav(e.target);