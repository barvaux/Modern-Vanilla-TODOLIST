import getTemplate from './template.js';
import './styles.scss';
import DB from "../../DB.js";
import Todo from "../todo/Todo.js";


// Définition de la classe TodoList
export default class TodoList {
  
  constructor(data) {
    // Configuration de l'URL de l'API à partir des données fournies
    DB.setApiURL(data.url);

    // Sélection de l'élément HTML spécifié par data.el
    this.el = document.querySelector(data.el);

    // Initialisation des propriétés pour stocker des éléments DOM et des listes de tâches
    this.todo_list = null;
    this.new_todo = null;
    this.todos = [];

    // Chargement des tâches depuis la base de données
    this.loadTodos();
   // Écoute des événements de mise à jour du compteur de tâches
    document.addEventListener('updateCounter', () => this.renderTodoCount());
  }

  // Méthode asynchrone pour charger les tâches depuis la base de données
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

  // Méthode pour afficher la liste de tâches
  render() {
    this.el.innerHTML = getTemplate(this);
    this.todo_list = this.el.querySelector(".todo-list");
    this.todos.forEach((todo) => {
      todo.render(this.todo_list);
    });
    this.activateElements();
    this.renderTodoCount();
  }

  // Méthode pour mettre à jour le compteur de tâches
  renderTodoCount() {
    this.el.querySelector(".todo-count strong").innerText = 
      this.todos.filter((todo) => !todo.completed).length;
  }

  
  activateElements() {
    // Sélection des éléments interactifs et ajout des gestionnaires d'événements
    this.new_todo = this.el.querySelector('.new-todo');
    this.clearCompletedButton = this.el.querySelector('.clear-completed');
    this.filterAll = this.el.querySelector('.filters a[href="#/"]');
    this.filterActive = this.el.querySelector('.filters a[href="#/active"]');
    this.filterCompleted = this.el.querySelector('.filters a[href="#/completed"]');

 
    // Gestionnaire d'événement pour l'ajout de nouvelles tâches
    this.new_todo.onkeyup = (e) => {
      if(e.code === "Enter" && this.new_todo.value != '') {
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

  // Méthode asynchrone pour ajouter une nouvelle tâche
  async addTodo() {
    const todoData = await DB.addOne({
      content: this.new_todo.value,
      completed: false
    });
    const newTodoInstance = new Todo(todoData);
    newTodoInstance.todoListInstance = this;
    this.todos.push(newTodoInstance);
    newTodoInstance.render(this.todo_list);
    this.new_todo.value = "";
    this.renderTodoCount();
  }

  // Méthode asynchrone pour nettoyer les tâches complétées
  async clearCompletedTodos() {
    const completedTodos = this.todos.filter(todo => todo.completed);
    for (let todo of completedTodos) {
        await DB.delete(todo.id); 
        const index = this.todos.indexOf(todo);
        if (index > -1) {
            this.todos.splice(index, 1); 
        }
    }
    this.render(); 
    this.renderTodoCount()
}

// Méthode pour filtrer les tâches en fonction du type de filtre
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