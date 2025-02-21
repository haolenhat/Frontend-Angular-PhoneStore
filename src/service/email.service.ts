import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/v1/mail'; // URL của backend

  constructor(private http: HttpClient) { }

  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new URLSearchParams();
    body.set('email', email);

    return this.http.post(`${this.apiUrl}/forgot-password`, body.toString(), { headers });
  }
}
