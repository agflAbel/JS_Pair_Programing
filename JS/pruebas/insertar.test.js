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
    // Prepara el DOM simulado
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

    // Mock del modelo con addTodo, getTodos y demás métodos necesarios
    mockModel = {
      getTodos: jest.fn(() => []),
      addTodo: jest.fn((title, description, dueDate) => ({
        id: '1',
        title,
        description,
        dueDate,
        completed: false,
      })),
      toggleCompleted: jest.fn(),
      editTodo: jest.fn(),
      findTodo: jest.fn(() => 0),
      todos: [{
        id: '1',
        title: 'Task 1',
        description: 'Test Description',
        dueDate: '2025-05-08',
        completed: false,
      }],
      removeTodo: jest.fn(),
    };

    // Crea la instancia de View y asigna el modelo mockeado
    view = new View();
    view.setModel(mockModel);
  });

  test('m_addToDo should add a new row', () => {
    view.addTodo('Task 1', 'Test Description', 'High');//estos son los datos que se van a insertar ficticiamente

    expect(mockModel.addTodo).toHaveBeenCalledWith('Task 1', 'Test Description', 'High');//Confirma que el modelo fue llamado y que contiene los mismos datos que se insertaron ficticiamente

    //Verifica que se agrego una nueva fila con los datos correctos.
    const rows = document.querySelectorAll('tr');
    expect(rows.length).toBe(2);
    expect(rows[1].children[0].textContent).toBe('Task 1');
  });
  
  
  
});
