let todos = [];

// 요소 노드 취득
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all');
const $clearBtn = document.querySelector('.btn');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');

// 브라우저 렌더링 함수
const render = () => {
  $todos.innerHTML = todos.map(({ id, content, completed }) => 
    `<li id="${id}" class="todo-item">
      <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
      <label for="ck-${id}">${content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>`).join('');

  // todo list <=> completed list 숫자 구현
  $completedTodos.textContent = todos.filter(todo => todo.completed).length;
  $activeTodos.textContent = todos.filter(todo => !todo.completed).length;

  if (!todos.length) $completeAll.firstElementChild.checked = false;
};

// TODO: 서버로부터 데이터 취득 함수
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
  // generateId를 한번만 만들기 위해 자유 변수로 만듦
  // 오류 코드
  // const generateId = () => Math.max(...todos.map(todo => todo.id)) + 1;
  // 수정 코드
  const generateId = () => todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;

  return content => {
    todos = [{ id: generateId(), content, completed: false }, ...todos];  
    render();
  };
})();

const removeTodo = id => {
  todos = todos.filter(todo => todo.id !== id);
  render();
};

const checkboxToggle = id => {
  todos = todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo);
  render();
};

const completeAll = checked => {
  todos = todos.map(todo => ({...todo, completed: checked}));
  render();
};

const clearCompleted = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
};

// 맨 처음 HTML 로드 완료 후 패치 함수 실행
document.addEventListener('DOMContentLoaded', fetchTodos);

// todo 추가 이벤트 핸들러 등록
$inputTodo.onkeyup = e => {
  const content = e.target.value;

  if (e.key !== 'Enter' || !content) return;

  addTodo(content);
  // content = ''; -> e.target.value 원시 값을 참조하고 있기 때문에, value 값을 변경할 수 없다.
  $inputTodo.value = '';
  $inputTodo.focus(); // -> focus를 안넣어도 됨
}

// 지우기 버튼 이벤트 핸들러 등록 -> 이벤트 위임
$todos.onclick = e => {
  if (!e.target.classList.contains('remove-todo')) return;

  removeTodo(+e.target.parentNode.id);
};

// checkbox toggle 이벤트 핸들러 등록 -> 이벤트 위임
$todos.onchange = e => checkboxToggle(+e.target.parentNode.id);

// completeAll 버튼 이벤트 핸들러 등록
$completeAll.onchange = e => completeAll(e.target.checked);

// clearCompleted 버튼 이벤트 핸들러 등록
$clearBtn.onclick = () => clearCompleted();