import getTemplate from './template.js';
import DB from '../../DB.js';

// Définition de la classe Todo
export default class Todo {
  // Constructeur de la classe Todo
  constructor(data) {
    // Initialise les propriétés du todo à partir des données fournies
    this.id = data.id;
    this.content = data.content;
    this.completed = data.completed;
    this.createdAt = data.createdAt;
  }

  // Méthode pour afficher un todo
  render(el) {
    // Insère le contenu du template dans l'élément HTML fourni
    el.insertAdjacentHTML('beforeend', getTemplate(this));
    const newTodo = el.lastElementChild;

    // Ajoute des gestionnaires d'événements pour le changement d'état, la suppression et l'édition du todo
    const checkbox = newTodo.querySelector('.toggle');
    if (checkbox) {
      checkbox.addEventListener('change', this.toggleCompleted.bind(this));
    }

    const deleteButton = newTodo.querySelector('.destroy');
    if (deleteButton) {
      deleteButton.addEventListener('click', this.deleteTodo.bind(this));
    }

    const label = newTodo.querySelector('.content');
    if (label) {
      label.addEventListener('dblclick', this.editTodo.bind(this));
    }
  }

  // Méthode pour changer l'état d'une todo
  async toggleCompleted(e) {
    // Met à jour l'état d'une todo en fonction de la case à cocher
    this.completed = e.target.checked;
    const todoElement = e.target.closest('li');

    try {
      // Met à jour l'état d'une todo dans la base de données
      await DB.update(this.id, { completed: this.completed });

      // Met à jour les styles en conséquence
      todoElement.classList.toggle('completed', this.completed);
    } catch (error) {
      console.error('Échec de la mise à jour du todo', error);
    }

    // Met à jour le compteur
    this.updateCount();
  }

  // Méthode pour supprimer une todo
  async deleteTodo(e) {
    // Supprime le todo de la base de données
    await DB.delete(this.id);
    const todoElement = e.target.closest('li');

    if (todoElement) {
      todoElement.remove();
    }

    // Supprime également le todo de la liste des todos
    const index = this.todoListInstance.todos.indexOf(this);
    if (index > -1) {
      this.todoListInstance.todos.splice(index, 1);
    }

    // Met à jour le compteur
    this.updateCount();
  }

  // Méthode pour mettre à jour le contenu d'une todo
  async updateContent(newContent) {
    // Met à jour le contenu de la todo dans la base de données
    try {
      await DB.update(this.id, { content: newContent });
      this.content = newContent;
    } catch (error) {
      console.error('Échec de la mise à jour du todo', error);
    }

    // Met à jour le compteur
    this.updateCount();
  }

  // Méthode pour éditer une todo
  editTodo(e) {
    const label = e.target;
    const listItem = label.closest('li');
    const input = document.createElement('input');

    input.type = 'text';
    input.value = this.content;
    input.className = 'edit';

    // Gère la fin de l'édition et la mise à jour du contenu
    input.addEventListener('blur', this.updateTodo.bind(this));
    input.addEventListener('keyup', (e) => {
      if (e.code === 'Enter' && input.value.trim() !== '') {
        input.blur();
      }
    });

    listItem.appendChild(input);
    listItem.classList.add('editing');
    input.focus();
  }

  // Méthode pour mettre à jour une todo après l'édition
  async updateTodo(e) {
    const input = e.target;
    const newContent = input.value.trim();
    const listItem = input.closest('li');
    const label = listItem.querySelector('.content');
    label.textContent = newContent;
    listItem.removeChild(input);
    listItem.classList.remove('editing');

    // Met à jour le contenu de la todo dans la base de données
    this.updateContent(newContent);
  }

  // Méthode pour mettre à jour le compteur
  updateCount() {
    // Crée un événement pour signaler la mise à jour du compteur
    const event = new Event('updateCounter');
    // Diffuse l'événement à l'application
    document.dispatchEvent(event);
  }
}
