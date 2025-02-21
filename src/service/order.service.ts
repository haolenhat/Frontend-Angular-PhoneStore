import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest } from '../app/model/OrderRequest.model';
import { Order } from '../app/model/myOrder.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  placeOrder(orderRequest: OrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/order/place`, orderRequest);
  }


  getVoucher(code: string): Observable<any> { return this.http.get<any>(`${this.apiUrl}/voucher/validate/${code}`); }

  getOrdersByCustomerId(idKh: number): Observable<Order[]> { return this.http.get<Order[]>(`${this.apiUrl}/order/findByCustomer/${idKh}`); }
}
