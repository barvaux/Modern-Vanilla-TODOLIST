import getTemplate from './template';
import DB from '../../DB'; // Assurez-vous d'importer DB depuis le bon chemin

export default class {
    constructor(data) {
        this.id = data.id;
        this.content = data.content;
        this.completed = data.completed;
        this.createdAt = data.createdAt;
    }

    render() {
        return getTemplate(this);
    }

    activateElements() {
        const toggleElements = this.element.querySelectorAll('.toggle');
        toggleElements.forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.toggleComplete();
            });
        });

        // Ajoutez un gestionnaire d'événements pour le bouton de suppression
        const deleteButton = this.element.querySelector('.destroy');
        deleteButton.addEventListener('click', () => {
            this.delete();
        });
    }

    toggleComplete() {
        this.completed = !this.completed;
        this.updateView(); // Mettez à jour la vue pour refléter le nouvel état de complétion

        // Appelez la méthode de l'API pour mettre à jour l'état dans l'API
        DB.updateComplete(this.id, this.completed)
            .then(response => {
                // Gérer la réponse de l'API si nécessaire
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour de l'état de complétion dans l'API:", error);
            });
    }

    delete() {
        this.deleteOneById(this.id); // Appelez la méthode de suppression de la tâche
    }

    // deleteOneById(todoId) {
    //     // Implémentez la logique de suppression ici
    //     // Par exemple, supprimez la tâche du DOM
    //     const todoElement = document.querySelector(`li[data-id="${todoId}"]`);
    //     if (todoElement) {
    //         todoElement.remove();
    //     }

    //     // Appelez la méthode de l'API pour supprimer la tâche de l'API
    //     DB.deleteOneById(todoId)
    //         .then(response => {
    //             // Gérer la réponse de l'API si nécessaire
    //         })
    //         .catch(error => {
    //             console.error("Erreur lors de la suppression de la tâche dans l'API:", error);
    //         });
    // }

    updateView() {
        const labelElement = this.element.querySelector('label');
        if (this.completed) {
            labelElement.style.textDecoration = 'line-through';
        } else {
            labelElement.style.textDecoration = 'none';
        }
    }
}
