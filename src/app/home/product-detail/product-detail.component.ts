import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { CartService } from '../../../service/cart.service';
import { CommentService } from '../../../service/comment.service';
import { CartItem, ProductOptionDTO, UserDTO } from '../../model/cart-item.model';
import { isPlatformBrowser } from '@angular/common';
import { Comment, Product, ProductOption } from '../../model/product.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @ViewChild('commentBox') commentBox: ElementRef | undefined

  product: Product | undefined;
  selectedColor: string = '';
  selectedStorage: string = '';
  selectedOption: ProductOption | undefined;
  cartItems: CartItem[] = [];
  comments: Comment[] = [];
  productId: number | null = null;
  currentUserId: number | null = null;
  showModalBox: boolean = false;
  commentToDelete: number | null | undefined = null;
  showLoginForm: boolean = false;
  showCommentBox: boolean = false;
  isEditing: boolean = false;
  editingCommentId: number | null | undefined = null;
  isAdding: boolean = false;

  paginatedComments: Comment[] = [];
  currentPage: number = 1;
  pageSize: number = 4;

  toggleCommentBox(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.showCommentBox = !this.showCommentBox;
    this.scrollToCommentBox();
  }


  newComment: any = {
    noiDung: '',
    danhGiaSao: null,
    product: {}
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private commentService: CommentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,

  ) {
    this.router.events.subscribe((event) => { if (event instanceof NavigationEnd) { window.scrollTo(0, 0); } });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id !== null ? +id : null;
    if (this.productId !== null) {
      this.fetchProduct(this.productId.toString());
      this.fetchComments(this.productId);
    }

    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('idKh');
      this.currentUserId = userId !== null ? +userId : null;

      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        this.cartItems = JSON.parse(storedCartItems);
      }
    } else {
      console.warn('localStorage is not available on the server');
    }
  }






  fetchProduct(id: string): void {
    this.productService.getProductById(id).subscribe((data: Product) => {
      this.product = {
        ...data,
        productOptions: data.productOptions?.map(option => ({
          ...option,
          product: undefined // Xóa thuộc tính product để tránh vòng lặp tham chiếu
        }))
      };

      if (this.product?.productOptions?.length > 0) {
        this.selectedOption = this.product.productOptions[0];
        this.selectedColor = this.selectedOption.mauSac;
        this.selectedStorage = this.selectedOption.dungLuong;
        this.updateSelectedOption(); // Cập nhật `selectedOption` sau khi thiết lập các giá trị ban đầu
      }
    }, error => {
      console.error('Error fetching product:', error);
    });
  }


  fetchComments(idSp: number): void {
    this.commentService.getCommentsByProductId(idSp).subscribe((comments: Comment[]) => {
      this.comments = comments;
      this.paginateComments();
    }, error => {
      console.error('Error fetching comments:', error);
      this.toastr.error('Không thể tải bình luận. Vui lòng thử lại.', 'Lỗi');
    });
  }

  onColorChange(color: string): void {
    this.selectedColor = color; // Cập nhật màu sắc đã chọn
    this.updateSelectedOption(); // Cập nhật option tương ứng
  }


  onStorageChange(storage: string): void {
    this.selectedStorage = storage;
    this.updateSelectedOption();
  }


  updateSelectedOption(): void {
    if (this.product) {
      this.selectedOption = this.product.productOptions.find(option =>
        option.mauSac === this.selectedColor && option.dungLuong === this.selectedStorage);

      if (this.selectedOption) {
        this.selectedOption.product = this.product;
      } else {
        console.error('Không tìm thấy tùy chọn sản phẩm phù hợp.');
      }
    }
  }

  getStorageOptions(): string[] {
    if (this.product && this.selectedColor) {
      return this.product.productOptions
        .filter(option => option.mauSac === this.selectedColor)
        .map(option => option.dungLuong);
    }
    return [];
  }


  addToCart(): void {
    const idKh = localStorage.getItem('idKh');

    if (!this.selectedColor || !this.selectedStorage) {
      this.toastr.error('Vui lòng chọn màu sắc và dung lượng trước khi thêm vào giỏ hàng.', 'Lỗi');
      return;
    }

    if (this.selectedOption && idKh) {
      if (this.selectedOption.product) {

        const newOption: ProductOptionDTO = {
          idTuyChon: this.selectedOption.idTuyChon,
          mauSac: this.selectedOption.mauSac,
          dungLuong: this.selectedOption.dungLuong,
          giaSp: this.selectedOption.giaSp,
          tenSp: this.selectedOption.product.tenSp,
          linkAnh: this.selectedOption.linkMauAnhSp,
          soLuong: this.selectedOption.soLuong
        };

        const newCartItem: CartItem = {
          user: { idKh: +idKh } as UserDTO,
          productOption: newOption,
          soLuong: 1,
          ngayTao: new Date().toISOString()
        };

        this.cartService.addCartItem(newCartItem).subscribe(
          (response) => {
            this.toastr.success('Thêm vào giỏ hàng thành công!', 'Success!');
          },
          (error) => {
            this.toastr.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.', 'Failed!');
          }
        );
      } else {
        this.toastr.error('Có lỗi xảy ra. Vui lòng thử lại.', 'Lỗi');
      }
    } else {
      this.toastr.error('Vui lòng chọn màu sắc và dung lượng trước khi thêm vào giỏ hàng.', 'Lỗi');
    }
  }


  addComment() {
    const idKh = localStorage.getItem('idKh');
    const idSp = this.route.snapshot.paramMap.get('id');

    if (!idKh || !idSp) {
      console.log('Không tìm thấy thông tin người dùng hoặc sản phẩm.');
      return;
    }

    if (!this.newComment.danhGiaSao) {
      this.toastr.error('Vui lòng đánh giá số sao trước khi thêm bình luận.', 'Lỗi');
      return;
    }

    const payload = {
      noiDung: this.newComment.noiDung,
      danhGiaSao: this.newComment.danhGiaSao,
      product: {
        idSp: idSp
      }
    };

    this.http.post(`http://localhost:8080/api/v1/comments/user/${idKh}`, payload)
      .subscribe({
        next: (response) => {
          this.toastr.success('Thêm bình luận thành công!', 'Success!');
          if (this.productId !== null) {
            this.fetchComments(this.productId);
          }
          this.cancelComment();
        },
        error: (error) => {
          console.error('Lỗi khi gửi bình luận:', error);
        }
      });
  }


  cancelComment(): void {
    this.showCommentBox = false;
    this.isEditing = false;
    this.isAdding = false;
    if (this.productId !== null) {
      this.newComment = { noiDung: '', danhGiaSao: 0, product: { idSp: this.productId } };
    }
  }

  onRatingChange(rating: number): void {
    this.newComment.danhGiaSao = rating;
  }


  editComment(comment: Comment): void {
    this.newComment.noiDung = comment.noiDung;
    this.newComment.danhGiaSao = comment.danhGiaSao;
    this.editingCommentId = comment.idBinhLuan;
    this.showCommentBox = true;
    this.isEditing = true;
    this.isAdding = false;
    this.scrollToCommentBox();
    setTimeout(() => { this.scrollToCommentBox(); }, 0);
  }


  updateComment(): void {
    const idKh = localStorage.getItem('idKh');
    if (!idKh || this.editingCommentId === null) {
      alert('Không tìm thấy thông tin người dùng hoặc bình luận.');
      return;
    }

    const payload = {
      noiDung: this.newComment.noiDung,
      danhGiaSao: this.newComment.danhGiaSao
    };

    this.http.put(`http://localhost:8080/api/v1/comments/user/${idKh}/comment/${this.editingCommentId}`, payload)
      .subscribe({
        next: (response) => {
          this.toastr.success('Cập nhật thành công!', 'Success!');
          if (this.productId !== null) {
            this.fetchComments(this.productId);
          }
          this.cancelComment();
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật bình luận:', error);
          this.toastr.error('Có lỗi khi cập nhật!', 'Error!');
        }
      });
  }


  scrollToCommentBox(): void {
    if (this.commentBox) {
      this.commentBox.nativeElement.scrollIntoView(
        { behavior: 'smooth', block: 'center' });
    }
  }

  confirmDeleteComment(commentId: number): void {
    this.commentToDelete = commentId;
    this.showModalBox = true;
  }


  deleteComment(): void {
    const idKh = localStorage.getItem('idKh');

    if (!idKh || this.commentToDelete == null) {
      console.log('Không tìm thấy thông tin người dùng hoặc bình luận.');
      return;
    }

    this.http.delete(`http://localhost:8080/api/v1/comments/user/${idKh}/comment/${this.commentToDelete}`)
      .subscribe({
        next: (response) => {
          this.toastr.success('Xoá bình luận thành công!', 'Success!');
          if (this.productId !== null) {
            this.fetchComments(this.productId);
          }
          this.cancelModalBox();
        },
        error: (error) => {
          console.error('Lỗi khi xóa bình luận:', error);
          this.toastr.error('Có lỗi xảy ra khi bình luận!', 'Error!');
        }
      });
  }
  cancelModalBox(): void {
    this.showModalBox = false;
    this.commentToDelete = null;
  }

  // Kiểm tra đăng nhập và thực hiện hành động
  checkLoginAndExecute(callback: () => void): void {
    const idKh = localStorage.getItem('idKh');
    if (!idKh) {
      this.showLoginForm = true;
    } else {
      callback();
    }
  }

  handleBuyNowClick(): void { this.checkLoginAndExecute(() => this.buyNow()); }

  handleAddToCartClick(): void { this.checkLoginAndExecute(() => this.addToCart()); }
  handleAddToCommentClick(): void { this.checkLoginAndExecute(() => this.toggleCommentBox()); }

  buyNow(): void {
    const idKh = localStorage.getItem('idKh');

    if (!idKh) {
      this.showLoginForm = true;
      return;
    }

    if (!this.selectedColor || !this.selectedStorage) {
      this.toastr.error('Vui lòng chọn màu sắc và dung lượng trước khi mua hàng.', 'Lỗi');
      return;
    }

    if (this.selectedOption) {
      if (this.selectedOption.product) {
        const newOption: ProductOptionDTO = {
          idTuyChon: this.selectedOption.idTuyChon,
          mauSac: this.selectedOption.mauSac,
          dungLuong: this.selectedOption.dungLuong,
          giaSp: this.selectedOption.giaSp,
          tenSp: this.selectedOption.product.tenSp,
          linkAnh: this.selectedOption.linkMauAnhSp,
          soLuong: this.selectedOption.soLuong
        };

        const newCartItem: CartItem = {
          user: { idKh: +idKh } as UserDTO,
          productOption: newOption,
          soLuong: 1,
          ngayTao: new Date().toISOString()
        };

        // Lưu sản phẩm vào localStorage
        localStorage.setItem('buyNowItem', JSON.stringify(newCartItem));

        // Chuyển hướng đến trang order
        this.router.navigate(['/home/order']);
      } else {
        this.toastr.error('Có lỗi xảy ra. Vui lòng thử lại.', 'Lỗi');
      }
    } else {
      this.toastr.error('Vui lòng chọn màu sắc và dung lượng trước khi mua hàng.', 'Lỗi');
    }
  }




  paginateComments(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedComments = this.comments.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateComments();
  }

  get totalPages(): number {
    return Math.ceil(this.comments.length / this.pageSize);
  }

  getTimeAgo(timestamp: string | undefined): string {
    if (!timestamp) {
      return 'Thời gian không xác định';
    }
    const timeAgo = moment(timestamp).fromNow();
    const formattedTime = moment(timestamp).format('DD/MM/YY, hh:mm A');
    return `${timeAgo} (${formattedTime})`;
  }






}
