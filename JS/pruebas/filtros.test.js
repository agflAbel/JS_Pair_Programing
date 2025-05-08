import View from '../view.js';

jest.mock('../components/add-todo', () => {
  return jest.fn().mockImplementation(() => ({ onClick: jest.fn() }));
});
jest.mock('../components/modal', () => {
  return jest.fn().mockImplementation(() => ({ onClick: jest.fn(), setValues: jest.fn() }));
});
jest.mock('../components/filters', () => {
  return jest.fn().mockImplementation(() => ({ onClick: jest.fn() }));
});

describe('View class - Filtro de tareas', () => {
  let view, mockModel;

  beforeEach(() => {
    document.body.innerHTML = `
      <table id="table">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
        <tr id="1">
          <td>Buy milk</td>
          <td>From the store</td>
          <td>2025-05-10</td>
          <td class="text-center"><input type="checkbox" /></td>
          <td class="text-right"></td>
        </tr>
        <tr id="2">
          <td>Write report</td>
          <td>For the meeting</td>
          <td>2025-05-11</td>
          <td class="text-center"><input type="checkbox" checked /></td>
          <td class="text-right"></td>
        </tr>
      </table>
      <button id="undo-btn" class="d-none"></button>
      <div id="confirmModal">
        <div class="modal-title"></div>
        <div class="modal-body"></div>
        <button id="confirm-delete-btn"></button>
      </div>
    `;

    mockModel = {
      getTodos: jest.fn(),
      addTodo: jest.fn(),
      toggleCompleted: jest.fn(),
      editTodo: jest.fn(),
      findTodo: jest.fn(),
      removeTodo: jest.fn(),
      todos: [],
    };

    view = new View();
    view.setModel(mockModel);
  });

  test('filter should hide tasks not matching the keyword and completion status', () => {
    view.filter({ type: 'completed', words: 'report' });

    const task1Row = document.getElementById('1');
    const task2Row = document.getElementById('2');

    expect(task1Row.classList.contains('d-none')).toBe(true);  // no coincide
    expect(task2Row.classList.contains('d-none')).toBe(false); // sí coincide
  });

  test('filter should show all tasks when type is "all" and no keywords', () => {
    view.filter({ type: 'all', words: '' });

    const task1Row = document.getElementById('1');
    const task2Row = document.getElementById('2');

    expect(task1Row.classList.contains('d-none')).toBe(false);
    expect(task2Row.classList.contains('d-none')).toBe(false);
  });

  test('filter should apply dueDate filter correctly', () => {
    view.filter({ type: 'all', words: '', dueDate: '2025-05-10' });

    const task1Row = document.getElementById('1'); // fecha coincide
    const task2Row = document.getElementById('2'); // fecha no coincide

    expect(task1Row.classList.contains('d-none')).toBe(false);
    expect(task2Row.classList.contains('d-none')).toBe(true);
  });
});
