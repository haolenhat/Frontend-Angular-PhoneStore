import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  user: any = {}; // Dùng để lưu thông tin người dùng
  editUser: any = {}; // Biến để chỉnh sửa thông tin người dùng
  showEditForm: boolean = false; // Biến điều khiển hiển thị form chỉnh sửa
  showChangePassword: boolean = false; // Biến điều khiển hiển thị form đổi mật khẩu
  newPassword: string = ''; // Biến lưu mật khẩu mới
  confirmNewPassword: string = ''; // Biến lưu mật khẩu xác nhận

  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = localStorage.getItem('idKh');
    if (userId) {
      this.http.get(`http://localhost:8080/api/v1/user/${userId}`).subscribe({
        next: (data: any) => {
          this.user = data;
        },
        error: (error) => console.error('Error fetching user data:', error)
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }

  // Phương thức chuyển đổi trạng thái hiển thị form đổi mật khẩu
  toggleChangePassword(event: Event): void {
    event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    this.showChangePassword = !this.showChangePassword;
  }

  // Phương thức chuyển đổi trạng thái hiển thị form chỉnh sửa
  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      this.editUser = { ...this.user };
    }
  }

  // Phương thức đóng form chỉnh sửa
  closeEditForm(): void {
    this.showEditForm = false;
  }

  // Phương thức kiểm tra tính hợp lệ của mật khẩu
  validatePassword(password: string): boolean {
    const passwordRegex = /^[A-Z][a-zA-Z0-9]{5,}$/;
    return passwordRegex.test(password);
  }

  // Phương thức xử lý cập nhật mật khẩu
  updatePassword(): void {
    if (!this.validatePassword(this.newPassword)) {
      this.toastr.error('Mật khẩu phải có ít nhất 6 ký tự và viết hoa chữ cái đầu.', 'Error!');
      console.error('Password must be at least 6 characters long and start with an uppercase letter');
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.toastr.error('Mật khẩu không khớp.', 'Error!');
      console.error('Passwords do not match');
      return;
    }

    const updatedUser = {
      ...this.user,
      matKhau: this.newPassword
    };

    this.http.put(`http://localhost:8080/api/v1/user/${this.user.idKh}`, updatedUser).subscribe({
      next: () => {
        this.toastr.success('Đổi mật khẩu thành công.', 'Success!');
        console.log('Password updated successfully');
        // Xóa các ký tự mật khẩu sau khi cập nhật thành công
        this.newPassword = '';
        this.confirmNewPassword = '';
        // Ẩn form đổi mật khẩu
        this.showChangePassword = false;
      },
      error: (error) => {
        this.toastr.error('Có lỗi xảy ra khi đổi mật khẩu.', 'Error!');
        console.error('Error updating password:', error);
      }
    });
  }

  // Phương thức xử lý cập nhật thông tin người dùng
  updateUserInfo(): void {
    const updatedUser = {
      idKh: this.user.idKh,
      tenKh: this.editUser.tenKh,
      mail: this.editUser.mail,
      role: this.user.role,
      matKhau: this.user.matKhau // Giữ nguyên mật khẩu cũ
    };

    this.http.put(`http://localhost:8080/api/v1/user/${this.user.idKh}`, updatedUser).subscribe({
      next: () => {
        this.toastr.success('Cập nhật thông tin thành công.', 'Success!');
        console.log('User information updated successfully');
        // Cập nhật thông tin hiển thị với dữ liệu mới
        this.user = { ...this.editUser };
        // Ẩn form chỉnh sửa
        this.showEditForm = false;
      },
      error: (error) => {
        this.toastr.error('Có lỗi xảy ra khi cập nhật thông tin.', 'Error!');
        console.error('Error updating user information:', error);
      }
    });
  }
}
