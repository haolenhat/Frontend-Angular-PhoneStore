import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  userInfo: any;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.signIn(this.username, this.password).subscribe(response => {
      this.authService.getUserInfo().subscribe(info => {
        this.userInfo = info;
        if (info.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          alert('Bạn không có quyền truy cập trang web này');
        }
      });
    }, error => {
      console.error('Login failed', error);
    });
  }
}
