let todos = [];
let todosNav;

// DOM nodes
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all');
const $clearCompleted = document.querySelector('.clear-completed');
const $completedCount = document.querySelector('.completed-todos');
const $activeCount = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');
const $allNav = document.getElementById('all');
const $activeNav = document.getElementById('active');
const $completedNav = document.getElementById('completed');


// 브라우저 렌더링
const render = () => {
  if ($allNav.classList.contains('active')) todosNav = todos;
  else if ($activeNav.classList.contains('active')) todosNav = todos.filter(todo => !todo.completed);
  else todosNav = todos.filter(todo => todo.completed);

  // innerHTML 방법
  // $todos.innerHTML = todosNav.map(({ id, content, completed }) => 
  //   `<li id="${id}" class="todo-item">
  //     <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
  //     <label for="ck-${id}">${content}</label>
  //     <i class="remove-todo far fa-times-circle"></i>
  //   </li>`).join('');

  
  // DocumentFragment 노드 생성 방법
  const $fragment = document.createDocumentFragment();

  $todos.textContent = '';
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
  });
  $todos.appendChild($fragment);
  
  $completedCount.textContent = todos.filter(todo => todo.completed).length;
  $activeCount.textContent = todos.filter(todo => !todo.completed).length;
  
  // if (!todos.length) $completeAll.firstElementChild.checked = false;
  
  if (todos.map(todo => todo.completed ? 1 : 0).includes(0)) $completeAll.firstElementChild.checked = false;
  else $completeAll.firstElementChild.checked = true;
};

// 서버 데이터 패치
const fetchTodos = () => {
  todos = [
    { id: 1, content: 'HTML', completed: false },
    { id: 2, content: 'CSS', completed: true },
    { id: 3, content: 'Javascript', completed: false },
  ];

  todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);
  render();
};

const addTodo = (() => {
  const generateId = () => todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  
  return content => {
    todos = [{ id: generateId(), content, completed: false }, ...todos];
    render();
  };
})();

const toggleTodo = id => {
  todos = todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo);
  render();
};

const removeTodo = id => {
  todos = todos.filter(todo => todo.id !== id);
  render();
};

const toggleAllTodo = checked => {
  todos = todos.map(todo => ({...todo, completed: checked}));
  render();
};

const removeCompleted = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
};

const seperateNav = target => {
  [...$nav.children].forEach(nav => nav.classList.toggle('active', nav === target));
  render();
};

document.addEventListener('DOMContentLoaded', fetchTodos);

$inputTodo.onkeyup = e => {
  const content = e.target.value;
  if (e.key !== 'Enter' || content === '') return;

  addTodo(content);
  e.target.value = '';
};

$todos.onchange = e => {
  if (!e.target.classList.contains('checkbox')) return;

  toggleTodo(+e.target.parentNode.id);
};

$todos.onclick = e => {
  if (!e.target.classList.contains('remove-todo')) return;

  removeTodo(+e.target.parentNode.id);
};

$completeAll.onchange = e => toggleAllTodo(e.target.checked);

$clearCompleted.onclick = e => removeCompleted();

$nav.onclick = e => seperateNav(e.target);