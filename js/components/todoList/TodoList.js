import DB from "../../DB";
import Todo from "../todo/Todo";
import getTemplate from './template.js';

export default class TodoList {
  constructor(data) {
    DB.setApiURL(data.apiURL);
    this.elt = document.querySelector(data.domELT);
    this.todos = [];
    this.newTodoInput = null;
    this.loadTodos();
  }

  async loadTodos() {
    const todos = await DB.findAll();
    this.todos = todos.map(todo => new Todo(todo));
    this.render();
  }

  render() {
    this.elt.innerHTML = getTemplate(this);
    this.activateElements();
    this.renderNotCompletedTodosCount();
  }

  renderNotCompletedTodosCount() {
    this.elt.querySelector('.todo-count strong').innerText =
      this.todos.filter(todo => !todo.completed).length;
  }

  activateElements() {
    this.newTodoInput = this.elt.querySelector('.new-todo');
    this.newTodoInput.addEventListener('keyup', e => {
      if (e.key === 'Enter' && this.newTodoInput.value !== '') {
        this.add();
      }
    });

    // Ajoutez l'écouteur d'événement pour la case à cocher ici
    this.elt.addEventListener('click', e => {
      if (e.target.matches('.toggle')) {
        const todoId = e.target.closest('li').getAttribute('data-id');
        this.toggleComplete(todoId);
      }
    });
  }

  add() {
    const todo = {
      id: new Date(),
      content: this.newTodoInput.value,
      completed: false,
    };
    const newTodo = new Todo(todo);
    this.todos.unshift(newTodo);

    const newTodoElement = document.createElement('div');
    newTodoElement.innerHTML = newTodo.render();

    // Ajoutez la classe .toggle à la case à cocher
    const toggleElement = newTodoElement.querySelector('.toggle');
    toggleElement.classList.add('toggle');

    document
      .querySelector('.todo-list')
      .insertBefore(newTodoElement, document.querySelector('.todo-list').children[0]);

    DB.addOne(todo);

    this.newTodoInput.value = '';
    this.renderNotCompletedTodosCount();
  }

  toggleComplete(todoId) {
    const todo = this.todos.find(todo => todo.id === todoId);

    if (todo) {
      todo.completed = !todo.completed;

      const todoElement = document.querySelector(`li[data-id="${todo.id}"]`);
      const labelElement = todoElement.querySelector('label');

      if (todo.completed) {
        labelElement.style.textDecoration = 'line-through';
      } else {
        labelElement.style.textDecoration = 'none';
      }

      DB.updateComplete(todo.id, todo.completed); // Utilisez la méthode correcte pour mettre à jour la complétion
      this.renderNotCompletedTodosCount();
    }
  }

  // deleteOneById(todoId) {
  //   // Trouver l'index de la tâche avec le todoId
  //   const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
  
  //   if (todoIndex !== -1) {
  //     // Supprimer la tâche de la liste this.todos
  //     this.todos.splice(todoIndex, 1);
  
  //     // Supprimer la tâche du DOM
  //     const todoElement = this.elt.querySelector(`li[data-id="${todoId}"]`);
  //     if (todoElement) {
  //       todoElement.remove();
  //     }
  
  //     // Supprimer la tâche de l'API
  //     DB.deleteOneById(todoId);
  
  //     // Mettre à jour le compteur de tâches non complétées
  //     this.renderNotCompletedTodosCount();
  //   }
  // }
  
}
