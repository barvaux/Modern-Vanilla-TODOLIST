// Création de la classe TodoList
// Avec comme propriétés:
// - elt, todos qui doit contenir des objets de type Todo
import DB from "../../DB";
import Todo from "../todo/Todo";
import getTemplate from './template.js';

export default class  {
    constructor(data){
        DB.setApiURL(data.apiURL);
        this.elt = document.querySelector(data.domELT);
        this.todos = [];
        this.loadTodos(); 
    }
    
    async loadTodos() {
        const todos = await DB.findAll();
        this.todos = todos.map(todo => new Todo(todo));
        this.render();
    }

    render () {
        this.elt.innerHTML = getTemplate(this);
    }

    renderNotCompletedTodosCount () {
        document.querySelector('.todo-count strong').innerText = this.todos.filter(todo => !todo.completed).length;
    }
    
}
