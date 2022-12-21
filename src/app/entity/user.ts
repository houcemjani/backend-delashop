export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthday: Date;
  address: string;
  password: string;

  validate(): string {

    if (this.lastName === undefined || this.lastName.length === 0) {
      return 'Le Nom n\'est peut pas être vide';

    } else if (this.firstName === undefined || this.firstName.length === 0) {
      return 'Le Prénom n\'est peut pas être vide';

    } else if (this.email === undefined || this.email.length === 0 || !this.validateEmail()) {
      return 'Email non valide';

    } else if (this.birthday === undefined) {
      return 'Il faut saisir la date de naissance';

    } else if (this.password === undefined || this.password.length === 0 || this.validatePassword()) {
      return 'Mot de passe non valide';
    }
    return '';
  }

  validateEmail(): boolean {
    return String(this.email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) != null
  }

  validatePassword(): boolean {
    if (this.password === undefined) {
      return false;
    }
    return String(this.password).toLowerCase().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/) != null;
  }

}
