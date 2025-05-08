import View from '../view.js';

// Mock de los componentes externos
jest.mock('../components/add-todo', () => {
  return jest.fn().mockImplementation(() => ({
    onClick: jest.fn(),
  }));
});
jest.mock('../components/modal', () => {
  return jest.fn().mockImplementation(() => ({
    onClick: jest.fn(),
    setValues: jest.fn(),
  }));
});
jest.mock('../components/filters', () => {
  return jest.fn().mockImplementation(() => ({
    onClick: jest.fn(),
  }));
});

describe('View class', () => {
  let view, mockModel;

  beforeEach(() => {
    // Prepara el DOM simulado con encabezado real
    document.body.innerHTML = `
      <table id="table">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </table>
      <button id="undo-btn" class="d-none"></button>
      <div id="confirmModal">
        <div class="modal-title"></div>
        <div class="modal-body"></div>
        <button id="confirm-delete-btn"></button>
      </div>
    `;

    // Mock del modelo
    mockModel = {
      addTodo: jest.fn(),
      getTodos: jest.fn(() => []),
      toggleCompleted: jest.fn(),
      editTodo: jest.fn(),
      findTodo: jest.fn(),
      removeTodo: jest.fn(),
      todos: [],
    };

    view = new View();
    view.setModel(mockModel);
  });

  test('removeTodo debería eliminar la fila correspondiente de la tabla y llamar al modelo', () => {
    // Prepara una tarea en el modelo y en la tabla
    const todo = { id: '1', title: 'Task 1', description: 'Desc', dueDate: '2025-05-08', completed: false };
    mockModel.todos = [todo];
    mockModel.findTodo = jest.fn(() => 0);
    mockModel.removeTodo = jest.fn();

    // Crea la fila manualmente (simulando que ya existe en el DOM)
    const table = document.getElementById('table');
    const row = table.insertRow();
    row.setAttribute('id', todo.id);
    row.insertCell().innerText = todo.title;
    row.insertCell().innerText = todo.description;
    row.insertCell().innerText = todo.dueDate;
    row.insertCell().innerHTML = '<input type="checkbox">';
    row.insertCell().innerHTML = '<button>Delete</button>';

    // Ejecuta el método
    view.removeTodo(todo.id);

    // Verifica que el modelo fue llamado correctamente
    expect(mockModel.findTodo).toHaveBeenCalledWith(todo.id);
    expect(mockModel.removeTodo).toHaveBeenCalledWith(todo.id);

    // Verifica que la fila fue eliminada del DOM
    expect(document.getElementById(todo.id)).toBeNull();
  });
});
