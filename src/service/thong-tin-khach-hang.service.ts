import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThongTinKhachHang } from '../app/model/thong-tin-khach-hang.model';

@Injectable({
  providedIn: 'root'
})
export class ThongTinKhachHangService {
  private baseUrl = 'http://localhost:8080/api/v1/order/info'; // Sử dụng URL API từ backend

  constructor(private http: HttpClient) { }

  addThongTinKhachHang(thongTinKhachHang: ThongTinKhachHang): Observable<ThongTinKhachHang> {
    return this.http.post<ThongTinKhachHang>(`${this.baseUrl}`, thongTinKhachHang)
      .pipe(
        catchError(this.handleError)
      );
  }

  getThongTinKhachHangByIdKh(idKh: number): Observable<ThongTinKhachHang[]> {
    return this.http.get<ThongTinKhachHang[]>(`${this.baseUrl}/${idKh}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateThongTinKhachHang(idThongTin: number, thongTinKhachHang: ThongTinKhachHang): Observable<ThongTinKhachHang> {
    return this.http.put<ThongTinKhachHang>(`${this.baseUrl}/${idThongTin}`, thongTinKhachHang)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteThongTinKhachHang(idThongTin: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idThongTin}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }

  placeOrder(orderRequest: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/order/place', orderRequest);
  }

}
