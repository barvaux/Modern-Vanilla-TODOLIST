import '../styles.scss';
import TodoList from './components/todoList/TodoList.js';

// Instancier une nouvelle TodoList
// en lui envoyant l'élément DOM sur lequel se greffer
// et l'URL de l'API à utiliser: https://6505bf24ef808d3c66f066f6.mockapi.io

new TodoList ({
    apiURL: "https://6505bf24ef808d3c66f066f6.mockapi.io",
    domELT: "#app"
});