export default class {

    static setApiURL (data) {
        this.apiURL = data;
    }
    
    static async findAll() {
        const reponse = await fetch(this.apiURL + "/todos");
        return await reponse.json();
    }

}