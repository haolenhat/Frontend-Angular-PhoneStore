import { Product } from './../../model/product.model';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { CartItem, CartItemWithChecked } from '../../model/cart-item.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItemWithChecked[] = [];
  selectedCartItems: CartItemWithChecked[] = []; // Thêm biến để lưu các sản phẩm được chọn

  quantityChangeSubject: Subject<CartItem> = new Subject<CartItem>();
  showModal: boolean = false;
  selectedCartItem: CartItem | null = null;
  totalCheckedPrice: number = 0; // Biến lưu tổng tiền của các sản phẩm được chọn

  showProductLimitModal: boolean = false;
  modalMessage: string = '';

  constructor(private cartService: CartService, private router: Router, private productService: ProductService) {
    this.router.events.subscribe((event) => { if (event instanceof NavigationEnd) { window.scrollTo(0, 0); } });

  }

  increaseQuantity(cartItem: CartItem): void {
    const idTuyChon = Number(cartItem.productOption.idTuyChon); // Chuyển đổi kiểu dữ liệu

    this.productService.getProductOptionById(idTuyChon).subscribe(productOption => {
      const maxStock = productOption.soLuong;
      console.log('ProductOption:', productOption);
      console.log('Max stock:', maxStock);

      if (cartItem.soLuong < maxStock) {
        cartItem.soLuong++;
        this.quantityChangeSubject.next(cartItem);
      } else {
        this.showProductLimitModal = true;
        this.modalMessage = `Chào bạn, hiện tại sản phẩm bạn chọn mua cửa hàng chúng tôi chỉ còn có ${maxStock} sản phẩm. Xin lỗi vì sự bất tiện này!`;
      }
    });
  }

  decreaseQuantity(cartItem: CartItem): void {
    if (cartItem.soLuong > 1) { // Giới hạn số lượng tối thiểu là 1
      cartItem.soLuong--;
      this.quantityChangeSubject.next(cartItem); // Gửi thông báo cập nhật số lượng
    }
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.quantityChangeSubject.pipe(debounceTime(1000)).subscribe(cartItem => {
      this.cartService.updateCartItem(cartItem).subscribe(response => {
        console.log('Cart item updated:', response);
      }, error => {
        console.error('Error updating cart item:', error);
      });
    });
  }

  loadCartItems(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const idKh = localStorage.getItem('idKh');
      const userId = idKh ? parseInt(idKh, 10) : null;

      if (userId) {
        this.cartService.getCartItems(userId).subscribe(items => {
          this.cartItems = items.map(item => ({
            ...item,
            checked: false
          }));
          console.log('Cart items loaded:', this.cartItems); // In ra console để kiểm tra
        });
      } else {
        console.error('User ID is not available or invalid.');
      }
    } else {
      console.error('localStorage is not available. This might be running on the server-side.');
    }
  }


  updateCartItemQuantity(cartItem: CartItem, quantity: number): void {
    this.productService.getProductOptionById(cartItem.productOption.idTuyChon).subscribe(productOption => {
      const maxStock = productOption.soLuong;

      if (quantity <= maxStock) {
        cartItem.soLuong = quantity;
        this.quantityChangeSubject.next(cartItem);
        this.updateCheckedTotal();
      } else {
        this.showProductLimitModal = true;
        this.modalMessage = `Chào bạn, hiện tại sản phẩm bạn chọn mua cửa hàng chúng tôi chỉ còn có ${maxStock} sản phẩm. Xin lỗi vì sự bất tiện này!`;
      }
    });
  }

  getCheckedTotalPrice(): number {
    return this.cartItems
      .filter(item => item.checked) // Lọc các sản phẩm được chọn
      .reduce((total, cartItem) => total + cartItem.productOption.giaSp * cartItem.soLuong, 0);
  }

  // Hàm tính tổng tiền các sản phẩm được chọn (checkbox)
  updateCheckedTotal(): void {
    this.totalCheckedPrice = this.cartItems
      .filter(item => item.checked) // Lọc các sản phẩm được chọn
      .reduce((total, item) => total + item.productOption.giaSp * item.soLuong, 0);
  }

  toggleModal(cartItem?: CartItem): void {
    this.showModal = !this.showModal;
    this.selectedCartItem = cartItem || null;
  }

  confirmDelete(): void {
    if (this.selectedCartItem && this.selectedCartItem.idGioHang !== undefined) {
      this.cartService.deleteCartItem(this.selectedCartItem.idGioHang).subscribe(
        () => {
          // Xóa sản phẩm khỏi giỏ hàng trên client
          this.cartItems = this.cartItems.filter(item => item !== this.selectedCartItem);
          this.updateCheckedTotal(); // Cập nhật tổng tiền khi xóa sản phẩm
          this.selectedCartItem = null;
          this.showModal = false; // Ẩn modal-box sau khi xóa thành công
        },
        (error: any) => {
          console.error('Error deleting cart item:', error);
        }
      );
    } else {
      console.error('Selected cart item or its idGioHang is undefined.');
    }
  }

  // Phương thức mới để hiển thị các sản phẩm được chọn và lưu vào localStorage
  displaySelectedCartItems(): void {
    this.selectedCartItems = this.cartItems.filter(item => item.checked).map(item => ({
      ...item,
      idSp: item.productOption.product?.idSp // Lưu idSp từ Product
    }));
    localStorage.setItem('selectedCartItems', JSON.stringify(this.selectedCartItems));
    this.router.navigate(['/home/order']);
  }

  closeProductLimitModal(): void { this.showProductLimitModal = false; }
}
