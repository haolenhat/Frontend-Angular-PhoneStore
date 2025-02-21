import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, ProductCategory, ProductOption } from '../app/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v1/product';

  constructor(private http: HttpClient) { }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  deleteProduct1(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete1/${id}`);
  }
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/all`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getProductOptionById(id: number): Observable<ProductOption> {
    return this.http.get<ProductOption>(`${this.baseUrl}/option/${id}`);
  }

  updateProductById(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/update/${id}`, product);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/search?keyword=${keyword}`);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.baseUrl}/categories`);
  }

  addCategory(categoryName: string): Observable<ProductCategory> {
    const newCategory = { tenDm: categoryName };
    return this.http.post<ProductCategory>(`${this.baseUrl}/add/category`, newCategory);
  }

  updateCategory(id: number, categoryName: string): Observable<ProductCategory> {
    const updatedCategory = { tenDm: categoryName };
    return this.http.put<ProductCategory>(`${this.baseUrl}/category/update/${id}`, updatedCategory);
  }

  deleteCategory(id: number): Observable<any> { // Thay đổi Observable<void> thành Observable<any>
    return this.http.delete(`${this.baseUrl}/category/del/${id}`, { responseType: 'text' });
  }

  // Thêm sản phẩm mới
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/create`, product);
  }

  // Thêm tùy chọn sản phẩm mới
  createProductOption(idSp: number, productOption: ProductOption): Observable<ProductOption> {
    return this.http.post<ProductOption>(`${this.baseUrl}/option/create/${idSp}`, productOption);
  }

  deleteProductOption(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/option/delete/${id}`);
  }


  updateProductOption(id: number, productOption: ProductOption): Observable<ProductOption> {
    return this.http.put<ProductOption>(`${this.baseUrl}/option/update/${id}`, productOption);
  }
  // Lấy 10 sản phẩm mới nhất
  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/latest`);
  }
}
