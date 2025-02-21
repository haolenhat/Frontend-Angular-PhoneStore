import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isBrowser: boolean = typeof window !== 'undefined' && window.localStorage !== undefined;

  constructor(private router: Router) { }

  canActivate(): boolean {
    // Kiểm tra xem đang chạy trên trình duyệt (client-side)
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');

      if (token && userRole === 'ADMIN') {
        return true;
      } else {
        this.router.navigate(['/admin/login']);
        return false;
      }
    } else {
      // Nếu đang chạy trên server, trả về false hoặc thực hiện xử lý khác nếu cần thiết
      return false;
    }
  }
}
