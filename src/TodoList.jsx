import { useEffect, useState } from "react";

const FILTERS = {
  DONE: "DONE",
  NOT_DONE: "NOT_DONE",
  NONE: "NONE",
};

const API_URL = "http://localhost:3000";

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
  const [todos, setTodos] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(FILTERS.NONE);

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter == FILTERS.DONE) return todo.done;
    if (currentFilter == FILTERS.NOT_DONE) return !todo.done;
    if (currentFilter == FILTERS.NONE) return true;
  });

  const changeFilter = (filter) => setCurrentFilter(filter);

  const createTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) throw new Error("Erro ao buscar os dados");
    } catch (err) {
      console.log("Erro ao criar tarefa.");
    }
  };

  const updateTodo = async ({ id, todo }) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) throw new Error("Erro ao buscar os dados");
    } catch (err) {
      console.log("Erro ao criar tarefa.");
    }
  };

  const addTodo = async (text) => {
    const newTodo = { id: crypto.randomUUID(), text, done: false };

    await createTodo(newTodo);

    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const markTodoAsDone = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTodo = { ...todo, done: true };

    await updateTodo({ id, todo: newTodo });

    const newTodos = todos.map((todo) => (todo.id === id ? newTodo : todo));
    setTodos(newTodos);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`${API_URL}/todos`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados");
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchTodos();
  }, []);

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
