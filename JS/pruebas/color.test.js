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

    // Mock de location.reload para evitar errores con jsdom
    delete window.location;
    window.location = { reload: jest.fn() };

    // Mock del modelo con métodos necesarios
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

    view = new View();
    view.setModel(mockModel);
  });

  test('m_addToDo should add a new row', () => {
    view.addTodo('Task 1', 'Test Description', 'High');

    expect(mockModel.addTodo).toHaveBeenCalledWith('Task 1', 'Test Description', 'High');

    const rows = document.querySelectorAll('tr');
    expect(rows.length).toBe(2); // encabezado + 1 tarea
    expect(rows[1].children[0].textContent).toBe('Task 1');
  });

  test('toggleCompleted should update task status', () => {
    mockModel.getTodos = jest.fn(() => mockModel.todos);
    view.render();

    const checkbox = document.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();

    checkbox.click();

    expect(mockModel.toggleCompleted).toHaveBeenCalledWith('1');
    expect(window.location.reload).toHaveBeenCalled();
  });

  describe('updateRowColor should set correct background color', () => {
    let row;

    beforeEach(() => {
      row = document.createElement('tr');
      document.body.appendChild(row);
    });

    afterEach(() => {
      document.body.removeChild(row);
    });

    test('should be green if task is completed before due date', () => {
      const todo = {
        completed: true,
        completedDate: '2025-05-01',
        dueDate: '2025-05-05',
      };
      const today = new Date('2025-05-01');
      const dueDate = new Date(todo.dueDate);
      view.updateRowColor(row, todo, today, dueDate);
      expect(row.style.backgroundColor).toBe('green');
    });

    test('should be gray if task is completed after due date', () => {
      const todo = {
        completed: true,
        completedDate: '2025-05-10',
        dueDate: '2025-05-05',
      };
      const today = new Date('2025-05-10');
      const dueDate = new Date(todo.dueDate);
      view.updateRowColor(row, todo, today, dueDate);
      expect(row.style.backgroundColor).toBe('gray');
    });

    test('should be blue if not completed and due date is in future', () => {
      const todo = {
        completed: false,
        dueDate: '2025-06-01',
      };
      const today = new Date('2025-05-01');
      const dueDate = new Date(todo.dueDate);
      view.updateRowColor(row, todo, today, dueDate);
      expect(row.style.backgroundColor).toBe('blue');
    });

    test('should be red if not completed and due date has passed', () => {
      const todo = {
        completed: false,
        dueDate: '2025-04-01',
      };
      const today = new Date('2025-05-01');
      const dueDate = new Date(todo.dueDate);
      view.updateRowColor(row, todo, today, dueDate);
      expect(row.style.backgroundColor).toBe('red');
    });
  });
});
