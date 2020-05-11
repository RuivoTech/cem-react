import Permissao from "./Permissao";

class Usuario {
    constructor() {
        this.explicitType =  "usuario";
        this.id = 0;
        this.nomeUsuario = "";
        this.senha = "";
        this.email = "";
        this.chEsMembro = "";
        this.chEsUsuario = "";
        this.permissoes = [Permissao];
    }
}

export default Usuario;