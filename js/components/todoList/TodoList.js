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
        this.newTodoInput = null;
        this.loadTodos(); 
    }
    
    async loadTodos() {
        const todos = await DB.findAll();
        this.todos = todos.map(todo => new Todo(todo));
        this.render();
    }

    render () {
        this.elt.innerHTML = getTemplate(this);
        this.activateElements();
        this.renderNotCompletedTodosCount();
    }

    renderNotCompletedTodosCount () {
        this.elt.querySelector('.todo-count strong').innerText = 
            this.todos.filter((todo) => !todo.completed).length;
    }

    activateElements() {
        this.newTodoInput = this.elt.querySelector('.new-todo');
        this.newTodoInput.addEventListener('keyup',  (e) => {
            if (e.key === 'Enter' && this.newTodoInput.value !== ''){
                this.add();
            } 
        });
    }

    add () {
        // 1. Ajout de la todo dans le this.todos
            const todo = {
                id: new Date(),
                content: this.newTodoInput.value,
                completed: false
                };
            const newTodo = new Todo(todo);
            this.todos.unshift(newTodo);
        // 2. Ajout de la todo dans le DOM
                // this.elt.querySelector('.todo-list').innerHTML = 
                // newTodo.render() + this.elt.querySelector('.todo-list').innerHTML;

                // Créer l'élément
                // Mettre le render dedans
                // faire un insertBefore
                const newTodoElement = document.createElement('div');
                document.querySelector('.todo-list').insertBefore(newTodoElement,document.querySelector('.todo-list').children[0]);
                newTodoElement.outerHTML = newTodo.render();

        // 3. Ajout de la todo dans l'API
                DB.addOne(todo);

            // 4. Je vide l'input
            this.newTodoInput.value = '';
            // 5. Je recompte les not completed
            this.renderNotCompletedTodosCount();
    }

}