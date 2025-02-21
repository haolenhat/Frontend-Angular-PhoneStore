import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/pay/create-payment-link';

  constructor(private http: HttpClient) { }

  createPaymentLink(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {}); // Không thay đổi
  }

}
