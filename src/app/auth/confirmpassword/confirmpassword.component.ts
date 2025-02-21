import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirmpassword.component.html',
  styleUrls: ['./confirmpassword.component.css'],
})
export class ConfirmpasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false; // Trạng thái loading

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Lấy token từ URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    console.log('Token từ URL:', this.token);

    // Kiểm tra token có hợp lệ không
    if (!this.token) {
      this.errorMessage = 'Token không hợp lệ. Vui lòng kiểm tra lại email.';
    }
  }

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    // Kiểm tra mật khẩu
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp. Vui lòng nhập lại.';
      return;
    }

    // Cấu hình header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Gửi request API
    this.isLoading = true;
    this.http
      .post(
        'http://localhost:8080/api/v1/user/reset-password',
        {
          token: this.token, // Token từ URL
          newPassword: this.newPassword,
        },
        { headers: headers }
      )
      .subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          this.successMessage = 'Mật khẩu đã được đặt lại thành công!';
          this.isLoading = false;

          // Chuyển hướng sau 3 giây
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (error: any) => {
          console.error('Error:', error);
          this.errorMessage =
            error.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
          this.isLoading = false;
        },
      });
  }
}
