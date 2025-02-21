import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1';
  private isBrowser: boolean = typeof window !== 'undefined' && window.localStorage !== undefined;

  constructor(private http: HttpClient) { }

  // đăng nhập
  signIn(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { mail: username, matKhau: password }; // Đảm bảo tên thuộc tính đúng như phía backend

    return this.http.post<any>(`${this.apiUrl}/auth/signin`, body, { headers })
      .pipe(map(response => {
        if (this.isBrowser) {
          // Chỉ lưu vào localStorage nếu đang chạy trong trình duyệt
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response;
      }));
  }

  // lấy thông tin User và lưu vào localStorage
  getUserInfo(): Observable<any> {
    const token = this.isBrowser ? localStorage.getItem('token') : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/user/info`, { headers }).pipe(map(user => {
      if (this.isBrowser) {
        // Chỉ lưu thông tin vào localStorage nếu đang chạy trong trình duyệt
        localStorage.setItem('idKh', user.idKh);
        localStorage.setItem('tenKh', user.tenKh);
        localStorage.setItem('role', user.role);
      }
      return user;
    }));
  }

  signUp(tenKh: string, mail: string, matKhau: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { tenKh, mail, matKhau }; // Đảm bảo tên thuộc tính đúng như phía backend

    return this.http.post<any>(`${this.apiUrl}/auth/signup`, body, { headers })
      .pipe(map(response => {
        return response;
      }));
  }

}
