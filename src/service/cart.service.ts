import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { CartItem } from '../app/model/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/v1/cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) { }

  addCartItem(cartItem: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/add`, cartItem).pipe(
      tap((newItem: CartItem) => {
        const currentItems = this.cartItemsSubject.value;
        this.cartItemsSubject.next([...currentItems, newItem]);
      })
    );
  }

  updateCartItem(cartItem: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/update`, cartItem);
  }

  getCartItems(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((items: CartItem[]) => {
        this.cartItemsSubject.next(items);
      })
    );
  }

  deleteCartItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${cartItemId}`);
  }
}
