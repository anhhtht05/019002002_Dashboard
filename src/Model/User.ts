export class User {
    id: number;
    name: string;
    role: string;
    state: string;
    email: string;

    constructor(id: number, name: string, role: string, state: string, email: string) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.state = state;
        this.email = email;
    }
  }
  