import { Component, Inject, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import { Product } from '../../model/product.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ProductService } from '../../../service/product.service';
import { UserService } from '../../../service/user.service'; // Import UserService
import { UserData } from '../../model/userData.model'; // Import model UserData
import { Router } from '@angular/router'; // Import Router
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isSearchVisible: boolean = false;
  searchResults: Product[] = [];
  private searchSubject: Subject<string> = new Subject<string>();
  searchKeyword: string = '';

  userId: string | null = null;
  userName: string | null = null;
  userRole: string | null = null;
  message: string = '';

  isSubnavOpen: boolean = false; // Thêm biến để quản lý trạng thái của header__subnav

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private productService: ProductService,
    private userService: UserService, // Inject UserService
    private router: Router, // Inject Router
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('idKh');
      this.isLoggedIn = !!this.userId; // Cập nhật isLoggedIn dựa trên giá trị userId từ localStorage
      if (this.userId) {
        this.getUserInfo(this.userId); // Gọi hàm lấy thông tin người dùng
      }

      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((keyword: string) => this.productService.searchProducts(keyword))
      ).subscribe({
        next: (data: Product[]) => {
          this.searchResults = data;
        },
        error: (error) => console.error('Error searching products:', error)
      });
    }
  }

  getUserInfo(idKh: string) {
    this.userService.getUserById(idKh).subscribe({
      next: (user: UserData) => {
        this.userName = user.tenKh; // Lưu tên người dùng vào biến userName
        this.userRole = user.role; // Lưu vai trò người dùng (nếu cần)
      },
      error: (error) => console.error('Error fetching user info:', error)
    });
  }

  showSearch(): void { this.isSearchVisible = true; }
  hideSearch(): void { setTimeout(() => { this.isSearchVisible = false; }, 200); }

  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchKeyword = inputElement?.value || '';
    if (this.searchKeyword.trim() !== '') {
      this.searchSubject.next(this.searchKeyword);
      this.isSearchVisible = true;
    } else {
      this.searchResults = [];
      this.isSearchVisible = false;
    }
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/home/product', productId]).then(() => {
      this.searchKeyword = '';
      this.searchResults = [];
      this.isSearchVisible = false;
    });
  }

  isLoggedIn: boolean = false;
  checkLoginAndNavigate(route: string): void { if (this.isLoggedIn) { this.router.navigate([`/home/${route}`]); } else { this.showLoginForm = true; } }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('idKh');
    localStorage.removeItem('tenKh');
    localStorage.removeItem('role');
    this.userId = null;
    this.userName = null;
    this.userRole = null;
    this.message = 'Đăng xuất thành công';
    this.toastr.success('Đăng xuất thành công!', 'Success!');
  }

  navigateToLogin(): void {
    this.router.navigate(['/signin']);
  }

  // Thêm logic để mở hoặc đóng header__subnav
  toggleSubnav(event: MouseEvent): void {
    event.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    this.isSubnavOpen = !this.isSubnavOpen;
  }

  @HostListener('document:click')
  closeSubnav(): void {
    this.isSubnavOpen = false; // Đóng menu khi click ra ngoài
  }

  showLoginForm: boolean = false;

  checkLoginAndExecute(callback: () => void): void {
    const idKh = localStorage.getItem('idKh');
    if (!idKh) {
      this.showLoginForm = true;
    } else {
      callback();
    }
  }
}
