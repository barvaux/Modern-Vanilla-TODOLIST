import getTemplate from './template.js';
import './styles.scss';
import DB from "../../DB.js";
import Todo from "../todo/Todo.js";

export default class TodoList {
  constructor(data) {
    // Configuration de l'URL de l'API
    DB.setApiURL(data.url);

    // Sélection des éléments HTML
    this.el = document.querySelector(data.el);
    this.todo_list = null;
    this.new_todo = null;
    this.todos = [];

    // Chargement des tâches depuis la base de données
    this.loadTodos();

    // Écoute des événements de mise à jour du compteur de tâches
    document.addEventListener('updateCounter', () => this.renderTodoCount());
  }

  async loadTodos() {
    // Récupération de toutes les tâches depuis la base de données
    const todos = await DB.findAll();

    // Création d'instances de la classe Todo pour chaque tâche
    this.todos = todos.map(todo => {
      const todoInstance = new Todo(todo);

      // Association des instances de Todo à cette instance de TodoList
      todoInstance.todoListInstance = this;
      return todoInstance;
    });

    // Affichage des tâches
    this.render();
  }

  render() {
    // Affichage du modèle dans l'élément HTML
    this.el.innerHTML = getTemplate(this);
    this.todo_list = this.el.querySelector(".todo-list");

    // Affichage de chaque tâche
    this.todos.forEach((todo) => {
      todo.render(this.todo_list);
    });

    // Activation des éléments interactifs
    this.activateElements();

    // Mise à jour du compteur
    this.renderTodoCount();
  }

  renderTodoCount() {
    // Mise à jour du compteur de tâches
    this.el.querySelector(".todo-count strong").innerText = 
      this.todos.filter((todo) => !todo.completed).length;
  }

  activateElements() {
    // Activation des éléments interactifs et ajout des gestionnaires d'événements
    this.new_todo = this.el.querySelector('.new-todo');
    this.clearCompletedButton = this.el.querySelector('.clear-completed');
    this.filterAll = this.el.querySelector('.filters a[href="#/"]');
    this.filterActive = this.el.querySelector('.filters a[href="#/active"]');
    this.filterCompleted = this.el.querySelector('.filters a[href="#/completed"]');

    // Gestionnaire d'événement pour l'ajout de nouvelles tâches
    this.new_todo.onkeyup = (e) => {
      if (e.code === "Enter" && this.new_todo.value != '') {
        this.addTodo();
      }
    };

    // Gestionnaire d'événement pour le nettoyage des tâches complétées
    this.clearCompletedButton.addEventListener('click', this.clearCompletedTodos.bind(this));

    // Gestionnaires d'événements pour le filtrage des tâches
    this.filterAll.addEventListener('click', () => this.filterTodos('all'));
    this.filterActive.addEventListener('click', () => this.filterTodos('active'));
    this.filterCompleted.addEventListener('click', () => this.filterTodos('completed'));
  }

  async addTodo() {
    // Ajout d'une nouvelle tâche à la base de données
    const todoData = await DB.addOne({
      content: this.new_todo.value,
      completed: false
    });

    // Création d'une instance de Todo pour la nouvelle tâche
    const newTodoInstance = new Todo(todoData);
    newTodoInstance.todoListInstance = this;
    this.todos.push(newTodoInstance);
    newTodoInstance.render(this.todo_list);
    this.new_todo.value = "";

    // Mise à jour du compteur
    this.renderTodoCount();
  }

  async clearCompletedTodos() {
    // Suppression des tâches complétées de la base de données
    const completedTodos = this.todos.filter(todo => todo.completed);
    for (let todo of completedTodos) {
      await DB.delete(todo.id);
      const index = this.todos.indexOf(todo);
      if (index > -1) {
        this.todos.splice(index, 1);
      }
    }

    // Mise à jour de l'affichage et du compteur
    this.render();
    this.renderTodoCount();
  }

  filterTodos(filterType) {
    const allTodos = this.el.querySelectorAll('.todo-list li');
    const filters = this.el.querySelectorAll('.filters a');
    filters.forEach(filter => filter.classList.remove('selected'));

    allTodos.forEach(todo => {
      const isCompleted = todo.classList.contains('completed');
      switch (filterType) {
        case 'all':
          todo.style.display = '';
          this.el.querySelector('.filters a[href="#/"]').classList.add('selected');
          break;
        case 'active':
          todo.style.display = isCompleted ? 'none' : '';
          this.el.querySelector('.filters a[href="#/active"]').classList.add('selected');
          break;
        case 'completed':
          todo.style.display = isCompleted ? '' : 'none';
          this.el.querySelector('.filters a[href="#/completed"]').classList.add('selected');
          break;
      }
    });
  }
}
