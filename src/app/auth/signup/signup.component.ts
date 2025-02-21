import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  tenKh: string = '';
  mail: string = '';
  matKhau: string = '';
  confirmMatKhau: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }
  onSubmit() {
    if (this.matKhau !== this.confirmMatKhau) {
      this.message = 'Mật khẩu nhập lại không khớp';
      return;
    }

    this.authService.signUp(this.tenKh, this.mail, this.matKhau).subscribe(response => {
      this.message = 'Đăng ký thành công!';
      this.router.navigate(['/signin']);
    }, error => {
      if (error.status === 409) { // 409 Conflict là mã trạng thái thường dùng cho lỗi "tài nguyên đã tồn tại"
        this.message = 'Email đã được sử dụng!';
      } else {
        this.message = 'Đăng ký thất bại!';

      }
      console.error('Sign up failed', error);
    });
  }

}
