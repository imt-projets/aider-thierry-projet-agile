export class ApiTimeoutError extends Error {
    constructor() {
      super("La requête a expiré (délai dépassé)");
      this.name = "ApiTimeoutError";
    }
  }
  
  export class ApiNetworkError extends Error {
    constructor() {
      super("Erreur de connexion au serveur");
      this.name = "ApiNetworkError";
    }
  }
  
  export class ApiNotFoundError extends Error {
    constructor(message = "Ressource non trouvée") {
      super(message);
      this.name = "ApiNotFoundError";
    }
  }
  
  export class ApiServerError extends Error {
    constructor(message = "Erreur serveur") {
      super(message);
      this.name = "ApiServerError";
    }
  }