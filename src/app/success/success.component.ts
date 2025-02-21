import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { ToastrService } from 'ngx-toastr';
import { Payment } from '../model/Payment.model';
import { Order } from '../model/order.model';
import { OrderDetail } from '../model/order-detail.model';
import { OrderRequest } from '../model/OrderRequest.model';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) { }

  ngOnInit() {

    localStorage.removeItem('buyNowItem');
    if (isPlatformBrowser(this.platformId)) {
      // Code inside this block will only run on the browser
      this.route.queryParams.subscribe(params => {
        const code = params['code'];
        const id = params['id'];
        const cancel = params['cancel'] === 'true';
        const status = params['status'];
        const orderCode = params['orderCode'];

        // Lấy thông tin tạm thời từ localStorage
        const orderRequest = JSON.parse(localStorage.getItem('orderRequest') || '{}');

        // Kiểm tra dữ liệu trong localStorage
        if (!orderRequest.order || !orderRequest.orderDetails || !orderRequest.payment) {
          console.error('Order data is missing in localStorage');
          return;
        }

        const order = orderRequest.order;
        const orderDetails = orderRequest.orderDetails;
        const payment = orderRequest.payment;

        // Chuẩn bị dữ liệu cho request POST
        const postData = { code, id, cancel, status, orderCode, order, orderDetails, payment };

        // Gửi yêu cầu POST tới backend
        this.http.post('http://localhost:8080/api/pay/payment-return', postData)
          .subscribe(response => {
            console.log('Payment return processed:', response);
            if (status === 'PAID') {
              // Xóa dữ liệu khỏi localStorage khi thanh toán thành công
              localStorage.removeItem('orderRequest');
              // Xử lý khi thanh toán thành công
            } else {
              // Xử lý khi thanh toán chưa thành công
            }
          }, error => {
            console.error('Error processing payment return:', error);
          });
      });
    } else {
      console.error('localStorage is not available.');
    }
  }
}
