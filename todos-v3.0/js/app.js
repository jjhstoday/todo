let todos = [];

// DOM nodes
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all');
const $clearCompleted = document.querySelector('.clear-completed');
const $completedCount = document.querySelector('.completed-todos');
const $activeCount = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');

// 브라우저 렌더링
const render = () => {
  $todos.innerHTML = todos.map(({ id, content, completed, style }) => 
    `<li id="${id}" class="todo-item" style="${style}">
      <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
      <label for="ck-${id}">${content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>`).join('');

  $completedCount.textContent = todos.filter(todo => todo.completed).length;
  $activeCount.textContent = todos.filter(todo => !todo.completed).length;
  console.log($todos);
  if (!todos.length) $completeAll.firstElementChild.checked = false;
}

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

  // if (target.matches('.nav > li#all')) todos = todos.filter(todo => todo.completed || !todo.completed);
  // if (target.matches('.nav > li#active')) todos = todos.filter(todo => !todo.completed);
  // if (target.matches('.nav > li#completed')) todos = todos.filter(todo => todo.completed);

  if (target.matches('.nav > li#all')) todos = todos.map(todo => ({...todo, style: `display`}));
  if (target.matches('.nav > li#active')) todos = todos.map(todo => !todo.completed ? {...todo, style: `display`} : {...todo, style: `display: none`});
  if (target.matches('.nav > li#completed')) todos = todos.map(todo => todo.completed ? {...todo, style: `display`} : {...todo, style: `display: none`});

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
}

$completeAll.onchange = e => toggleAllTodo(e.target.checked);

$clearCompleted.onclick = e => removeCompleted();

$nav.onclick = e => seperateNav(e.target);
