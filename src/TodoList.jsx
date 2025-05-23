import { useState } from "react";

const FILTERS = {
  DONE: "DONE",
  NOT_DONE: "NOT_DONE",
  NONE: "NONE",
};

const initialState = [
  { id: crypto.randomUUID(), text: "Learn React", done: false },
  { id: crypto.randomUUID(), text: "Learn JS", done: true },
];

const AddTodo = ({ addTodo }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const input = event.target;
      const text = input.value.trim();
      if (text) {
        addTodo(text);
        input.value = "";
      }
    }
  };

  return (
    <input
      type="text"
      placeholder="Adicione aqui sua nova tarefa"
      onKeyDown={handleKeyPress}
    />
  );
};

const TodoFilter = ({ changeFilter }) => {
  const onSelectFilter = (filter) => {
    changeFilter(filter);
  };

  return (
    <div className="center-content">
      <a href="#" id="filter-all" onClick={() => onSelectFilter(FILTERS.NONE)}>
        Todos os itens
      </a>
      <a href="#" id="filter-done" onClick={() => onSelectFilter(FILTERS.DONE)}>
        Concluídos
      </a>
      <a
        href="#"
        id="filter-pending"
        onClick={() => onSelectFilter(FILTERS.NOT_DONE)}
      >
        Pendentes
      </a>
    </div>
  );
};

const TodoItem = ({ todo, markTodoAsDone }) => {
  const handleClick = () => {
    markTodoAsDone(todo.id);
  };

  return (
    <>
      {todo.done ? (
        <li style={{ textDecoration: "line-through" }}>{todo.text}</li>
      ) : (
        <li>
          {todo.text}
          <button onClick={handleClick}>Concluir</button>
        </li>
      )}
    </>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState(initialState);
  const [currentFilter, setCurrentFilter] = useState(FILTERS.NONE);

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter == FILTERS.DONE) return todo.done;
    if (currentFilter == FILTERS.NOT_DONE) return !todo.done;
    if (currentFilter == FILTERS.NONE) return true;
  });

  const changeFilter = (filter) => {
    setCurrentFilter(filter);
  };

  const addTodo = (text) => {
    const newTodo = { id: crypto.randomUUID(), text, done: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const markTodoAsDone = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, done: true } : todo))
    );
  };

  return (
    <>
      <h1>Todo List</h1>
      <div className="center-content">
        Versão inicial da aplicação de lista de tarefas para a disciplina
        SPODWE2
      </div>
      <TodoFilter changeFilter={changeFilter} />
      <AddTodo addTodo={addTodo} />
      <ul id="todo-list">
        {filteredTodos.map((todo, index) => (
          <TodoItem key={index} todo={todo} markTodoAsDone={markTodoAsDone} />
        ))}
      </ul>
    </>
  );
};

export { TodoList };
