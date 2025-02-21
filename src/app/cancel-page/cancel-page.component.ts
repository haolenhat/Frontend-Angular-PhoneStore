import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cancel-page',
  templateUrl: './cancel-page.component.html',
  styleUrls: ['./cancel-page.component.css'] // Sửa lại thành 'styleUrls'
})
export class CancelPageComponent implements OnInit {
  countdown: number = 10; // Thời gian đếm ngược
  intervalId: any; // ID của interval để có thể clear sau


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    localStorage.removeItem('buyNowItem');
    const orderRequest = JSON.parse(localStorage.getItem('orderRequest') || '{}');
    console.log('Temporary Order Request from localStorage:', orderRequest);

    // Lấy các tham số query từ URL
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const id = params['id'];
      const cancel = params['cancel'] === 'true';
      const status = params['status'];
      const orderCode = params['orderCode'];

      // Lấy thông tin tạm thời từ localStorage

      // Chuẩn bị dữ liệu cho request POST
      const postData = {
        code, id, cancel, status, orderCode,
        order: orderRequest.order,
        orderDetails: orderRequest.orderDetails,
        payment: orderRequest.payment
      };
      console.log('Sending POST request with data:', postData);

      // Gửi yêu cầu POST tới backend để xử lý kết quả hủy thanh toán
      this.http.post('http://localhost:8080/api/pay/payment-return', postData)
        .subscribe(response => {
          console.log('Cancel payment result processed:', response);
          localStorage.removeItem('orderRequest');
        }, error => {
          console.error('Error processing cancel payment result:', error);
        });

      // Bắt đầu đếm ngược
      this.startCountdown();
    });
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/home']); // Chuyển hướng sau 10 giây
      }
    }, 1000);
  }

  ngOnDestroy() {
    // Dọn dẹp interval khi component bị hủy
    clearInterval(this.intervalId);
  }

  navigateHome() {
    clearInterval(this.intervalId); // Dọn dẹp interval nếu người dùng nhấn vào liên kết
    this.router.navigate(['/home']); // Chuyển hướng ngay lập tức
  }
}
