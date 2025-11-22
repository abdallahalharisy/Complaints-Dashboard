import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // This makes it a singleton
})
export class SessionService {
  token: string = '';
  username: string = '';
  role: string = '';
  // Add more session-related fields here

  clear() {
    this.token = '';
    this.username = '';
    this.role = '';
  }
}
