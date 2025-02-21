import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { City, District, Ward } from '../../model/location.model';
import { ThongTinKhachHang } from '../../model/thong-tin-khach-hang.model';
import { ThongTinKhachHangService } from '../../../service/thong-tin-khach-hang.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartItem, CartItemWithChecked } from '../../model/cart-item.model';
import { error } from 'node:console';
import { Payment } from '../../model/Payment.model';
import { Order } from '../../model/order.model';
import { OrderDetail } from '../../model/order-detail.model';
import { OrderRequest } from '../../model/OrderRequest.model';
import { OrderService } from '../../../service/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  voucherCode: string = ''; // Mã voucher nhập từ người dùng
  discountAmount: number = 0; // Giá trị giảm giá được áp dụng
  voucher: any = null;
  isProcessing: boolean = false;

  isCodSelected: boolean = false;
  thongTinKhachHang: ThongTinKhachHang = {
    idThongTin: 0,
    idKh: 0,
    tenNguoiNhan: '',
    diaChi: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    sdtKh: '',
    ghiChu: '',
    ngayCapNhat: new Date(),
    selected: false
  };
  selectedCartItems: CartItemWithChecked[] = []; // Dữ liệu giỏ hàng đã chọn
  paymentMethod: string = 'Cod'; // Phương thức thanh toán mặc định là Cod
  totalAmount: number = 0; // Tổng giá trị đơn hàng bao gồm phí vận chuyển
  selectedAddress: ThongTinKhachHang | null = null; // Địa chỉ giao hàng đã chọn
  shippingFee: number = 30000; // Phí vận chuyển cố định

  // Danh sách địa phương
  cities: City[] = [];
  districts: District[] = [];
  wards: Ward[] = [];

  // Thông tin khách hàng
  thongTinKhachHangList: ThongTinKhachHang[] = [];
  thongTinKhachHangToDelete: ThongTinKhachHang | null = null;

  // Biến kiểm soát trạng thái
  result: string = '';
  isEditing = false;
  isEditMode = false;
  isModalOpen = false;
  isAddingNew = false;

  // ViewChild
  @ViewChild('formElement') formElement!: ElementRef;
  @ViewChild('modalBox') modalBox!: ElementRef;

  // API host
  private host = 'https://provinces.open-api.vn/api/';

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private thongTinKhachHangService: ThongTinKhachHangService,
    private router: Router,
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe((event) => { if (event instanceof NavigationEnd) { window.scrollTo(0, 0); } });

  }

  ngOnInit(): void {
    const idKh = localStorage.getItem('idKh');
    if (idKh) {
      this.thongTinKhachHang.idKh = parseInt(idKh, 10);
      this.loadThongTinKhachHang(this.thongTinKhachHang.idKh);
    }

    const storedCartItems = localStorage.getItem('selectedCartItems');
    if (storedCartItems) {
      this.selectedCartItems = JSON.parse(storedCartItems);
      console.log('Selected Cart Items from localStorage:', this.selectedCartItems);
    }

    // Kiểm tra sản phẩm từ "Mua ngay"
    const buyNowItem = localStorage.getItem('buyNowItem');
    if (buyNowItem) {
      const item: CartItemWithChecked = JSON.parse(buyNowItem);
      this.selectedCartItems = [item];
      localStorage.removeItem('buyNowItem'); // Xóa khỏi localStorage sau khi đọc
    }

    if (this.selectedCartItems.length === 0) {
      this.router.navigate(['/home']);
    }

    this.loadCities();

    // Xử lý kết quả thanh toán
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const id = params['id'];
      const cancel = params['cancel'] === 'true';
      const status = params['status'];
      const orderCode = params['orderCode'];

      this.http.post('http://localhost:8080/api/pay/payment-return', {
        code,
        id,
        cancel,
        status,
        orderCode
      })
        .subscribe(
          response => {
            console.log('Payment result processed:', response);
          },
          error => {
            console.error('Error processing payment result:', error);
          }
        );
    });
  }


  loadCities() {
    this.callAPI<City[]>(`${this.host}?depth=1`).subscribe(
      (data) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error loading cities:', error);
      }
    );
  }

  callAPI<T>(api: string) {
    return this.http.get<T>(api);
  }

  onCityChange(event: any): void {
    const cityId = event.target.selectedOptions[0].getAttribute('data-id');
    this.callAPI<{ districts: District[] }>(`${this.host}p/${cityId}?depth=2`).subscribe(
      (data) => {
        this.districts = data.districts;
        this.wards = [];
        this.thongTinKhachHang.tinhThanh = event.target.value;
        this.updateResult();
      },
      (error) => {
        console.error('Error loading districts:', error);
      }
    );
  }

  onDistrictChange(event: any): void {
    const districtId = event.target.selectedOptions[0].getAttribute('data-id');
    this.callAPI<{ wards: Ward[] }>(`${this.host}d/${districtId}?depth=2`).subscribe(
      (data) => {
        this.wards = data.wards;
        this.thongTinKhachHang.quanHuyen = event.target.value;
        this.updateResult();
      },
      (error) => {
        console.error('Error loading wards:', error);
      }
    );
  }

  onWardChange(event: any): void {
    this.thongTinKhachHang.phuongXa = event.target.value;
    this.updateResult();
  }

  updateResult(): void {
    const city = (document.getElementById('city') as HTMLSelectElement).selectedOptions[0].text;
    const district = (document.getElementById('district') as HTMLSelectElement).selectedOptions[0].text;
    const ward = (document.getElementById('ward') as HTMLSelectElement).selectedOptions[0].text;
    this.result = `${city} | ${district} | ${ward}`;
  }

  // Quản lý thông tin khách hàng
  saveThongTinKhachHang(): void {
    console.log('Saving ThongTinKhachHang:', this.thongTinKhachHang);
    this.thongTinKhachHangService.addThongTinKhachHang(this.thongTinKhachHang)
      .subscribe(
        response => {
          console.log('API Response:', response); // Log phản hồi từ API
          this.toastr.success('Thêm thông tin thành công!');
          this.thongTinKhachHangList.push(response); // Thêm đối tượng vào danh sách hiện tại
          this.isEditing = false;
          this.isEditMode = false;
          this.isAddingNew = false;
        },
        error => {
          console.error('API Error:', error); // Log lỗi từ API
          this.toastr.error('Có lỗi xảy ra khi thêm thông tin!');
        }
      );
  }

  loadThongTinKhachHang(idKh: number): void {
    this.thongTinKhachHangService.getThongTinKhachHangByIdKh(idKh).subscribe(
      (data) => {
        console.log('Data from API:', data); // Debug log
        this.thongTinKhachHangList = data;
      },
      (error) => {
        console.error('Error loading data:', error); // Debug error
      }
    );
  }

  editThongTinKhachHang(info: ThongTinKhachHang): void {
    this.thongTinKhachHang = { ...info };
    this.isEditing = true;
    this.isEditMode = true; // Chuyển sang trạng thái chỉnh sửa
    this.isAddingNew = false; // Đảm bảo không ở trạng thái thêm mới
    setTimeout(() => {
      this.formElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }

  updateThongTinKhachHang(): void {
    console.log('Updating ThongTinKhachHang:', this.thongTinKhachHang);
    this.thongTinKhachHangService.updateThongTinKhachHang(this.thongTinKhachHang.idThongTin, this.thongTinKhachHang)
      .subscribe(
        response => {
          console.log('API Response:', response);
          this.toastr.success('Thông tin khách hàng được cập nhật thành công!');
          this.loadThongTinKhachHang(this.thongTinKhachHang.idKh); // Load lại thông tin khách hàng
          this.isEditing = false;
          this.isEditMode = false;
        },
        error => {
          console.error('API Error:', error);
          this.toastr.error('Có lỗi xảy ra khi cập nhật thông tin!');
        }
      );
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.isEditMode = false;
    this.isAddingNew = false;
  }

  confirmDeleteThongTinKhachHang(info: ThongTinKhachHang): void {
    this.thongTinKhachHangToDelete = info;
    this.modalBox.nativeElement.style.display = 'block';
  }

  cancelDelete(): void {
    this.isModalOpen = false;
    this.modalBox.nativeElement.style.display = 'none';
  }

  deleteThongTinKhachHang(): void {
    if (this.thongTinKhachHangToDelete) {
      this.thongTinKhachHangService.deleteThongTinKhachHang(this.thongTinKhachHangToDelete.idThongTin)
        .subscribe(
          () => {
            this.toastr.success('Thông tin khách hàng đã được xóa thành công!');
            this.thongTinKhachHangList = this.thongTinKhachHangList.filter(
              (info) => info.idThongTin !== this.thongTinKhachHangToDelete!.idThongTin
            );
            this.modalBox.nativeElement.style.display = 'none';
            this.thongTinKhachHangToDelete = null;
          },
          (error) => {
            this.toastr.error('Có lỗi xảy ra khi xóa thông tin khách hàng!');
            console.error('Delete error:', error);
          }
        );
    }
  }

  showAddAddressForm(): void {
    this.isEditing = true;
    this.isEditMode = false;
    this.isAddingNew = true;
    this.thongTinKhachHang = {
      idThongTin: 0,
      idKh: this.thongTinKhachHang.idKh,
      tenNguoiNhan: '',
      diaChi: '',
      tinhThanh: '',
      quanHuyen: '',
      phuongXa: '',
      sdtKh: '',
      ghiChu: '',
      ngayCapNhat: new Date(),
      selected: false
    };
  }

  placeOrder(): void {
    const idKh = localStorage.getItem('idKh') ? parseInt(localStorage.getItem('idKh')!, 10) : 0;

    if (!this.validateSelectedAddress()) {
      return;
    }

    const tongGia = this.calculateTotalPrice();
    const orderRequest = this.createOrderRequest(idKh, tongGia);

    if (this.paymentMethod === 'pay-online') {
      this.handleOnlinePayment(orderRequest, tongGia); // Thanh toán trực tuyến
    } else {
      this.saveOrder(tongGia, idKh);
    }
  }



  handleOnlinePayment(orderRequest: any, tongGia: number): void {
    this.http.post('http://localhost:8080/api/pay/create-payment-link', orderRequest)
      .subscribe(
        (response: any) => {
          const checkoutUrl = response.checkoutUrl;

          // Lưu thông tin đơn hàng tạm thời vào localStorage
          localStorage.setItem('orderRequest', JSON.stringify(orderRequest));

          // Điều hướng tới URL thanh toán
          window.location.href = checkoutUrl;
        },
        (error: HttpErrorResponse) => {
          console.error('Error creating payment link:', error);
          this.toastr.error('Có lỗi xảy ra khi tạo liên kết thanh toán. Vui lòng thử lại.', 'Failed!');
        }
      );
  }




  validateSelectedAddress(): boolean {
    if (!this.selectedAddress) {
      this.toastr.error('Vui lòng chọn địa chỉ giao hàng.');
      return false;
    }

    const requiredFields = [
      'tenNguoiNhan',
      'diaChi',
      'tinhThanh',
      'quanHuyen',
      'phuongXa',
      'sdtKh'
    ];

    for (const field of requiredFields) {
      if (!this.selectedAddress[field]) {
        this.toastr.error('Địa chỉ giao hàng không đầy đủ. Vui lòng kiểm tra lại.');
        return false;
      }
    }

    return true;
  }

  calculateTotalPrice(): number {
    const totalProductPrice = this.selectedCartItems.reduce((total, item) => {
      return total + (item.productOption.giaSp * item.soLuong);
    }, 0);

    return totalProductPrice + this.shippingFee - this.discountAmount;
  }





  createOrderRequest(idKh: number, tongGia: number) {
    const order = {
      idKh,
      ngayLap: new Date().toISOString(),
      maDonHang: this.generateOrderCode(),
      tongGia,
      phiShip: this.shippingFee,
      idVoucher: this.voucher?.idVoucher || null,
      ...this.selectedAddress
    };

    const orderDetails = this.selectedCartItems.map(item => ({
      idSp: item.productOption.product?.idSp,
      soLuongMua: item.soLuong,
      donGia: item.productOption.giaSp,
      idTuyChon: item.productOption.idTuyChon
    }));

    const payment = {
      phuongThuc: this.paymentMethod,
      soTien: tongGia
    };

    return { order, orderDetails, payment };
  }

  saveOrder(tongGia: number, idKh: number) {
    this.isProcessing = true; // Hiển thị modal
    const orderRequest = this.createOrderRequest(idKh, tongGia);

    this.http.post('http://localhost:8080/api/v1/order/place', orderRequest).subscribe(
      (response: any) => {
        console.log('Order placed successfully', response);
        if (response.status === 'success') {
          this.toastr.success('Đặt hàng thành công!', 'Success!');
          this.clearCart();
          this.router.navigate(['/success']);
        } else {
          this.toastr.error(response.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'Failed!');
        }
        this.isProcessing = false; // Ẩn modal
      },
      (error: HttpErrorResponse) => {
        console.error('Error placing order:', error);
        this.toastr.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'Failed!');
        this.isProcessing = false; // Ẩn modal
      }
    );
  }


  processPaymentSuccess() {
    const orderRequest = JSON.parse(localStorage.getItem('orderRequest') || '{}');

    // Sau khi thanh toán trực tuyến thành công, lưu thông tin đơn hàng vào API /api/v1/order/place
    this.http.post('http://localhost:8080/api/v1/order/place', orderRequest)
      .subscribe(
        (response: any) => {
          console.log('Order saved successfully after payment', response);
          if (response.status === 'success') {
            this.toastr.success('Đặt hàng thành công sau khi thanh toán!', 'Success!');
            this.clearCart();
            this.router.navigate(['/success']);
          } else {
            this.toastr.error(response.message || 'Có lỗi xảy ra khi lưu đơn hàng sau khi thanh toán. Vui lòng thử lại.', 'Failed!');
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Error saving order after payment:', error);
          this.toastr.error('Có lỗi xảy ra khi lưu đơn hàng sau khi thanh toán. Vui lòng thử lại.', 'Failed!');
        }
      );
  }



  clearCart(): void {
    this.selectedCartItems.forEach(item => {
      localStorage.removeItem(`product-${item.productOption.idTuyChon}`);
    });
    localStorage.removeItem('selectedCartItems');
  }




  generateOrderCode(): string {
    return 'DH' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  onCancel(): void {
    localStorage.removeItem('selectedCartItems'); localStorage.removeItem('orderRequest');
    this.router.navigate(['/home/cart']);
  }


  applyVoucher(): void {
    this.orderService.getVoucher(this.voucherCode).subscribe(
      (data) => {
        this.voucher = data;

        // Kiểm tra số lượng mã giảm giá
        if (this.voucher.soLuong <= 0) {
          this.discountAmount = 0;
          this.toastr.error('Mã giảm giá đã hết số lượng và không thể sử dụng.', 'Error');
          return;
        }

        const total = this.calculateTotalProductPrice();

        if (this.isVoucherValid(this.voucher)) {
          if (this.voucher.loaiVoucher === 'PERCENT') {
            this.discountAmount = (this.voucher.giaTri / 100) * total;
          } else if (this.voucher.loaiVoucher === 'AMOUNT') {
            this.discountAmount = this.voucher.giaTri;
          }

          // Đảm bảo tổng tiền sản phẩm không âm
          if (total - this.discountAmount < 0) {
            this.discountAmount = total;
          }

          this.toastr.success('Áp dụng mã giảm giá thành công!', 'Success!');
        } else {
          this.discountAmount = 0;
          this.toastr.error('Mã giảm giá không hợp lệ hoặc đã hết hạn', 'Error');
        }
        this.updateTotalAmount();
      },
      (error) => {
        this.discountAmount = 0;
        this.toastr.error('Không thể áp dụng mã giảm giá', 'Error');
        this.updateTotalAmount();
      }
    );
  }


  isVoucherValid(voucher: any): boolean {
    const now = new Date();
    const startDate = new Date(voucher.ngayBatDau);
    const endDate = new Date(voucher.ngayKetThuc);

    return now >= startDate && now <= endDate;
  }

  calculateTotalProductPrice(): number {
    return this.selectedCartItems.reduce((total, item) => total + item.productOption.giaSp * item.soLuong, 0);
  }

  updateTotalAmount(): void {
    const totalProductPrice = this.calculateTotalProductPrice();
    this.totalAmount = totalProductPrice + this.shippingFee - this.discountAmount;
  }



}
