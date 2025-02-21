import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../app/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://localhost:8080/api/v1/comments';

  constructor(private http: HttpClient) { }

  getCommentsByProductId(idSp: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/product/${idSp}`);
  }

  addComment(idKh: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/user/${idKh}`, comment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


}
