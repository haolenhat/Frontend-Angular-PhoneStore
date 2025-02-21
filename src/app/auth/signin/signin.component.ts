import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  username: string = '';
  password: string = '';
  userInfo: any;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onSubmit() {
    this.authService.signIn(this.username, this.password).subscribe(response => {
      this.authService.getUserInfo().subscribe(info => {
        this.userInfo = info;
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('idKh', this.userInfo.idKh);
        localStorage.setItem('userName', this.userInfo.tenKh);
        localStorage.setItem('userRole', this.userInfo.role);
        console.log(this.userInfo);
        this.router.navigate(['/home']);
        this.toastr.success('Đăng nhập thành công!.', 'Success!');

      });
    }, error => {
      console.error('Login failed', error);
      this.toastr.error('Thông tin tài khoản hoặc mật khẩu không chính xác!.', 'Failed');

    });
  }

}
