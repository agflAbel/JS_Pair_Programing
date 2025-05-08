import View from '../view.js';

// Mocks de componentes externos para evitar dependencias en el test
jest.mock('../components/add-todo', () => {
  return jest.fn().mockImplementation(() => ({ onClick: jest.fn() }));
});
jest.mock('../components/modal', () => {
  return jest.fn().mockImplementation(() => ({
    onClick: jest.fn(),
    setValues: jest.fn(),
  }));
});
jest.mock('../components/filters', () => {
  return jest.fn().mockImplementation(() => ({ onClick: jest.fn() }));
});

describe('View class - Recuperar tareas del LocalStorage', () => {
  let view, mockModel;

  beforeEach(() => {
    // Prepara el DOM con tabla y encabezado reales
    document.body.innerHTML = `
      <table id="table">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>DueDate</th>
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

    // Mock del modelo con tareas simulando datos recuperados de LocalStorage
    mockModel = {
      getTodos: jest.fn(() => [
        {
          id: '1',
          title: 'Tarea LocalStorage',
          description: 'Recuperada del LS',
          dueDate: '2025-06-01',
          completed: false,
        },
        {
          id: '2',
          title: 'Otra tarea',
          description: 'También del LS',
          dueDate: '2025-06-02',
          completed: true,
        },
      ]),
    };

    view = new View();
    view.setModel(mockModel);
  });
  test('render should display todos from the model (localStorage simulation)', () => {
    // Simula que getTodos devuelve una lista con una tarea (como si viniera del localStorage)
    mockModel.getTodos.mockReturnValueOnce([
      {
        id: '2',
        title: 'Stored Task',
        description: 'Recovered from localStorage',
        dueDate: '2025-05-10',
        completed: false,
      },
    ]);
  
    // Llama a render para que cree las filas
    view.render();
  
    // Verifica que se haya creado una fila adicional
    const rows = document.querySelectorAll('tr');
    expect(rows.length).toBe(2); // 1 encabezado + 1 tarea
  
    // Verifica que el contenido sea correcto
    expect(rows[1].children[0].textContent).toBe('Stored Task');
    expect(rows[1].children[1].textContent).toBe('Recovered from localStorage');
  });
  
});
