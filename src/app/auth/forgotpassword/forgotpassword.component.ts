import { Component } from '@angular/core';
import { EmailService } from '../../../service/email.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  email: string = '';


  constructor(private http: HttpClient) { }

  onSubmit() {
    const url = 'http://localhost:8080/api/v1/mail/forgot-password';
    this.http.post(url, null, { params: { email: this.email } }).subscribe(
      (response) => {
        console.log('Password reset email sent:', response);
      },
      (error) => {
        console.error('Lỗi:', error);
      }
    );
  }
}