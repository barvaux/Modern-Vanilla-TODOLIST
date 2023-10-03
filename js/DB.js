export default class {

    static setApiURL (data) {
        this.apiURL = data;
    }
    
    static async findAll() {
        const reponse = await fetch(this.apiURL + "/todos");
        return await reponse.json();
    }


    static async addOne (data){
        const reponse = await fetch(this.apiURL + "/todos", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        return await reponse.json();
    }

    static async updateComplete(todoId, isCompleted) {
        const response = await fetch(`${this.apiURL}/todos/${todoId}`, {
            method: 'PUT', // mettre à jour la tâche
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: isCompleted })
        });
        return await response.json();
    }
    
    
}