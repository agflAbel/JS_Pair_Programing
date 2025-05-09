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
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Due Date</th>
        <th>Completed</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr id="1" class="">
        <td class="title">Tarea 1</td>
        <td class="description">Descripción 1</td>
        <td class="dueDate">2025-05-10</td>
        <td class="completed"><input type="checkbox" checked></td>
      </tr>
      <tr id="2" class="">
        <td class="title">Tarea 2</td>
        <td class="description">Descripción 2</td>
        <td class="dueDate">2025-05-15</td>
        <td class="completed"><input type="checkbox"></td>
      </tr>
    </tbody>
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

    expect(task2Row.classList.contains('d-none')).toBe(true);
  });
});
