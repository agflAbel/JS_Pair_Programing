/**
 * @jest-environment jsdom
 */
import View from '../view';

jest.mock('../components/addToDo', () => { //Estos mocks simulan los componentes externos (addToDo, modal, filters) para que no interfieran en el test y no hagan cosas reales
    return jest.fn().mockImplementation(() => ({
      m_click: jest.fn(),
    }));
  });

jest.mock('../components/modal', () => {
  return jest.fn().mockImplementation(() => ({ //Estos mocks simulan los componentes externos (addToDo, modal, filters) para que no interfieran en el test y no hagan cosas reales
    m_onClick: jest.fn(),
    m_setValues: jest.fn(),
  }));
});

jest.mock('../components/filters', () => { //Estos mocks simulan los componentes externos (addToDo, modal, filters) para que no interfieran en el test y no hagan cosas reales
  return jest.fn().mockImplementation(() => ({
    m_onClick: jest.fn(),
  }));
});

describe('View class', () => {
  let view, mockModel, table;

  beforeEach(() => {
    document.body.innerHTML = `
      <table id="table">
        <tr><th>Title</th><th>Description</th><th>Priority</th><th>Completed</th><th>Actions</th></tr>
      </table>
    `;
    view = new View();

    mockModel = { //este es el mock simulado del model, en otras palabras, si8mula la estructura de un model convencional del codigo
      m_addToDo: jest.fn((title, desc, priority) => ({
        id: '123',
        title,
        description: desc,
        priority,
        completed: false,
      })),
    };

    view.m_setModel(mockModel);
  });

  test('m_addToDo should add a new row', () => {
    view.m_addToDo('Task 1', 'Test Description', 'High');//estos son los datos que se van a insertar ficticiamente

    expect(mockModel.m_addToDo).toHaveBeenCalledWith('Task 1', 'Test Description', 'High');//Confirma que el modelo fue llamado y que contiene los mismos datos que se insertaron ficticiamente

    //Verifica que se agrego una nueva fila con los datos correctos.
    const rows = document.querySelectorAll('tr');
    expect(rows.length).toBe(2);
    expect(rows[1].children[0].textContent).toBe('Task 1');
  });
});