import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use proxy in development, direct URL in production
  private apiUrl = '/api'; // Proxy will forward to http://192.168.43.174:3000

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    console.log('Sending login request to:', `${this.apiUrl}/auth/signin`);
    console.log('Payload:', payload);
    
    return this.http.post(`${this.apiUrl}/auth/signin`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  forgetPassword(email: string): Observable<any>
  {
    let params = new HttpParams()
    .set('email', email)
    return this.http.get(`${this.apiUrl}/employee/auth/forget-password`,{
params
},

    );
  }
  resetPassword(password: string,token:string ): Observable<any>
  {
    let params = new HttpParams()
    .set('token', token)
    return this.http.post(`${this.apiUrl}/employee/auth/confirm-password`,{
"newPassword":password
},{
  params
}

    );
  }


}
