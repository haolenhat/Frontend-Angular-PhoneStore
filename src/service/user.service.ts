import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../app/model/userData.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) { }

  // hiển thị full danh sách user
  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.baseUrl}/all`);
  }

  // tìm kiếm danh sách user
  searchUsers(query: string): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.baseUrl}/search`,
      { params: { query } });
  }
  //update thông tin users
  updateUser(user: UserData): Observable<UserData> {
    return this.http.put<UserData>(`${this.baseUrl}/update`, user);
  }
  //xoá người dùng
  deleteUser(idKh: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${idKh}`);
  }
  getUserById(idKh: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/${idKh}`);
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post('http://localhost:8080/api/v1/mail/reset-password', {
      token: token,
      newPassword: newPassword,
    });
  }

}




