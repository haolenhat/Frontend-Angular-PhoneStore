import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { Order } from '../../model/myOrder.model';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api/v1/order/update/'; // URL của API

  orders: Order[] = [];

  constructor(private http: HttpClient, private orderService: OrderService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {

    this.router.events.subscribe((event) => { if (event instanceof NavigationEnd) { window.scrollTo(0, 0); } });

  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Now safely access localStorage and window
      const idKh = localStorage.getItem('idKh');
      if (idKh) {
        const parsedIdKh = parseInt(idKh, 10);
        if (!isNaN(parsedIdKh)) {
          this.orderService.getOrdersByCustomerId(parsedIdKh).subscribe(
            (data) => {
              this.orders = data;
            },
            (error) => {
              console.error('Error fetching orders', error);
            }
          );
        } else {
          console.error('Invalid user ID');
        }
      } else {
        console.error('User ID is not found in localStorage');
      }
    } else {
      console.error('Running on server-side, cannot access localStorage');
    }
  }


  addDays(date: string, days: number): string {
    const result = new Date(date); result.setDate(result.getDate() + days); const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return result.toLocaleDateString('vi-VN', options);
  }


  getStatusText(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Đang gói hàng';
      case 'Processing':
        return 'Đang chuẩn bị vận chuyển';
      case 'Shipped':
        return 'Đang vận chuyển';
      case 'Delivered':
        return 'Đã giao';
      case 'Cancel':
        return 'Đã huỷ';
      default:
        return status;
    }
  }
  showModal: boolean = false;  // Biến để kiểm tra hiển thị modal
  selectedOrderId: number | null = null;


  // Hàm gọi API để huỷ đơn hàng
  cancelOrder(idDdh: number) {
    this.selectedOrderId = idDdh;  // Lưu id đơn hàng cần huỷ
    this.showModal = true;  // Hiển thị modal
  }
  // Hàm thực hiện huỷ đơn hàng khi người dùng chọn "Yes"
  confirmCancelOrder() {
    const updatedOrder = {
      idDdh: this.selectedOrderId,
      tinhTrang: {
        idTinhTrang: 5,  // ID của trạng thái 'Cancel'
        tinhTrang: 'Cancel'
      }
    };

    this.http.put(`http://localhost:8080/api/v1/order/update/${this.selectedOrderId}`, updatedOrder)
      .subscribe(
        (response) => {
          console.log('Đơn hàng đã huỷ', response);
          // Cập nhật trạng thái đơn hàng trong UI sau khi API trả về thành công
          const order = this.orders.find(o => o.idDdh === this.selectedOrderId);
          if (order) {
            order.tinhTrang.tinhTrang = 'Cancel';  // Cập nhật trạng thái trực tiếp trong UI
          }
          this.showModal = false;  // Đóng modal sau khi huỷ đơn hàng
        },
        (error) => {
          console.error('Lỗi khi huỷ đơn hàng:', error);
          this.showModal = false;  // Đóng modal nếu có lỗi
        }
      );
  }

  // Hàm đóng modal nếu người dùng chọn "No"
  cancelModal() {
    this.showModal = false;
  }

}
