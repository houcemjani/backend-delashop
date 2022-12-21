
export class LoginResponse {
  token: string;

  constructor(obj: any) {
    this.token = obj.token;
  }
}


