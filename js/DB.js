export default class DB {
    // Méthode pour définir l'URL de l'API
    static setApiURL(data) {
      // Stocker l'URL de l'API fournie en tant que propriété statique
      this.apiURL = data;
    }
  
    // Méthode pour récupérer tous les todos depuis l'API
    static async findAll() {
      // Effectuer une requête asynchrone pour obtenir la liste de todos depuis l'URL de l'API
      const response = await fetch(this.apiURL + "/todos");
      // Parser la réponse JSON et la retourner
      return await response.json();
    }
  
    // Méthode pour ajouter un nouveau todo à l'API
    static async addOne(data) {
      // Effectuer une requête asynchrone pour ajouter un todo à l'API
      const response = await fetch(this.apiURL + "/todos", {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      // Parser la réponse JSON et la retourner
      return await response.json();
    }
  
    // Méthode pour mettre à jour un todo existant dans l'API
    static async update(id, data) {
      // Effectuer une requête asynchrone pour mettre à jour un todo spécifique dans l'API
      const response = await fetch(`${this.apiURL}/todos/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Vérifier si la réponse est OK (réussie) ou gérer l'erreur
      if (response.ok) {
        // Parser la réponse JSON et la retourner
        return await response.json();
      } else {
        // Lancer une erreur en cas d'échec de la mise à jour
        throw new Error('Une erreur est survenue lors de la mise à jour');
      }
    }
  
    // Méthode pour supprimer un todo spécifique de l'API
    static async delete(id) {
      try {
        // Effectuer une requête asynchrone pour supprimer un todo spécifique de l'API
        const response = await fetch(`${this.apiURL}/todos/${id}`, {
          method: 'DELETE',
        });
  
        // Vérifier si la réponse est OK (réussie) ou gérer l'erreur
        if (!response.ok) {
          // Lancer une erreur en cas d'échec de la suppression
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        // Parser la réponse JSON et la retourner
        return await response.json();
      } catch (error) {
        console.error("Une erreur est survenue lors de la suppression :", error);
      }
    }
  }
  