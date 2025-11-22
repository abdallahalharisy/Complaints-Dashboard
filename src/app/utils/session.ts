export class Session{

  private _fullName: string = '';
  public get fullName(): string {
      return this._fullName;
  }
  public set fullName(value: string) {
      this._fullName = value;
  }
  private _phonNumbr: string = '';
  public get phonNumbr(): string {
      return this._phonNumbr;
  }
  public set phonNumbr(value: string) {
      this._phonNumbr = value;
  }
  private _email: string = '';
  public get email(): string {
      return this._email;
  }
  public set email(value: string) {
      this._email = value;
  }

  private _token: string = '';

  public get token(): string {
      return this._token;
  }
  public set token(value: string) {
      this._token = value;
  }

}
