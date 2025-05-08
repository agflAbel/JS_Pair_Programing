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

describe('View class - editar tarea', () => {
  let view, mockModel;

  beforeEach(() => {
    // Prepara el DOM con encabezado real
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
      editTodo: jest.fn(),
      todos: [],
    };

    view = new View();
    view.setModel(mockModel);
  });

  test('editTodo debería actualizar la fila correspondiente y llamar al modelo', () => {
    // Prepara una tarea en el modelo y en la tabla
    const todo = { id: '1', title: 'Task 1', description: 'Desc', dueDate: '2025-05-08', completed: false };
    mockModel.todos = [todo];

    // Crea la fila manualmente (simulando que ya existe en el DOM)
    const table = document.getElementById('table');
    const row = table.insertRow();
    row.setAttribute('id', todo.id);
    row.insertCell().innerText = todo.title;
    row.insertCell().innerText = todo.description;
    row.insertCell().innerText = todo.dueDate;
    const completedCell = row.insertCell();
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    completedCell.appendChild(checkbox);
    row.insertCell().innerHTML = '<button>Edit</button>';

    // Nuevos valores para editar
    const newValues = {
      title: 'Edited Task',
      description: 'Edited Desc',
      dueDate: '2025-06-01',
      completed: true,
    };

    // Ejecuta el método
    view.editTodo(todo.id, newValues);

    // Verifica que el modelo fue llamado correctamente
    expect(mockModel.editTodo).toHaveBeenCalledWith(todo.id, newValues);

    // Verifica que la fila fue actualizada en el DOM
    const editedRow = document.getElementById(todo.id);
    expect(editedRow.children[0].innerText).toBe('Edited Task');
    expect(editedRow.children[1].innerText).toBe('Edited Desc');
    expect(editedRow.children[2].innerText).toBe('2025-06-01');
    expect(editedRow.children[3].children[0].checked).toBe(true);
  });
});
