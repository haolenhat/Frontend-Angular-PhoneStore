import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  products: Product[] = [];
  discountedProducts: Product[] = [];
  suggestedProducts: Product[] = [];
  paginatedAllProducts: Product[] = [];
  paginatedDiscountedProducts: Product[] = [];
  paginatedSuggestedProducts: Product[] = [];
  categories: { idDm: number, tenDm: string }[] = [];
  itemsPerPage: number = 10;
  searchKeyword: string = '';
  selectedCategory: string = 'all';

  pageSize: number = 10; // Số lượng sản phẩm mỗi trang
  currentAllPage: number = 1;
  currentDiscountedPage: number = 1;
  currentSuggestedPage: number = 1;
  totalAllPages: number = 0;
  totalDiscountedPages: number = 0;
  totalSuggestedPages: number = 0;

  private searchSubject: Subject<string> = new Subject<string>();
  constructor(private productService: ProductService, private router: Router) {
    this.totalAllPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.paginateAllProducts();
  }

  ngOnInit(): void {
    this.fetchProducts();

    this.searchSubject.pipe(
      debounceTime(300), // Chờ 300ms sau mỗi lần nhập liệu
      distinctUntilChanged(), // Chỉ thực hiện khi từ khóa thay đổi
      switchMap((keyword: string) => this.productService.searchProducts(keyword))
    ).subscribe({
      next: (data: Product[]) => {
        console.log('Search data:', data); // Kiểm tra dữ liệu trả về
        this.products = data;
        this.filterProductsByCategory();
      },
      error: (error) => console.error('Error searching products:', error)
    });

  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.discountedProducts = data.filter(product =>
          product.productOptions.some(option => option.khuyenMai !== 0)
        );
        this.suggestedProducts = data.filter(product =>
          product.soLuotDanhGia !== 0 && product.soLuotBinhLuan !== 0
        );

        this.totalAllPages = Math.ceil(this.products.length / this.pageSize);
        this.totalDiscountedPages = Math.ceil(this.discountedProducts.length / this.pageSize);
        this.totalSuggestedPages = Math.ceil(this.suggestedProducts.length / this.pageSize);

        this.paginateAllProducts();
        this.paginateDiscountedProducts();
        this.paginateSuggestedProducts();

        this.extractCategories();
        this.filterProductsByCategory(); // Gọi hàm lọc sau khi lấy dữ liệu
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }

  // filterProductsByCategory(): void {
  //   if (this.selectedCategory === 'all') {
  //     this.paginatedAllProducts = [...this.products];
  //   } else {
  //     this.paginatedAllProducts = this.products.filter(product => product.productCategory?.idDm === +this.selectedCategory);
  //   }

  //   this.totalAllPages = Math.ceil(this.paginatedAllProducts.length / this.pageSize);
  //   this.currentAllPage = 1;
  //   this.paginateAllProducts();
  // }


  extractCategories(): void {
    const categoryMap = new Map();
    this.products.forEach(product => {
      if (product.productCategory) {
        categoryMap.set(product.productCategory.idDm, product.productCategory.tenDm);
      }
    });
    this.categories = Array.from(categoryMap, ([idDm, tenDm]) => ({ idDm, tenDm }));
  }

  filterProductsByCategory(): void {
    // Lọc sản phẩm theo danh mục
    if (this.selectedCategory === 'all') {
      this.paginatedAllProducts = [...this.products];  // Thêm dấu [...] để tạo bản sao mới
    } else {
      this.paginatedAllProducts = this.products.filter(product => product.productCategory?.idDm === +this.selectedCategory);
    }

    // Cập nhật lại tổng số trang
    this.totalAllPages = Math.ceil(this.paginatedAllProducts.length / this.pageSize);

    // Đặt lại trang hiện tại về trang đầu tiên
    this.currentAllPage = 1;

    // Cập nhật lại phân trang
    this.paginateAllProducts();
  }





  goToAllPage(page: number): void {
    if (page >= 1 && page <= this.totalAllPages) {
      this.currentAllPage = page;
      this.paginateAllProducts();  // Gọi lại paginateAllProducts để cập nhật danh sách sản phẩm cho trang mới
    }
  }


  paginateDiscountedProducts(): void {
    const start = (this.currentDiscountedPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDiscountedProducts = this.discountedProducts.slice(start, end);
  }

  paginateSuggestedProducts(): void {
    const start = (this.currentSuggestedPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedSuggestedProducts = this.suggestedProducts.slice(start, end);
  }




  goToDiscountedPage(page: number): void {
    if (page >= 1 && page <= this.totalDiscountedPages) {
      this.currentDiscountedPage = page;
      this.paginateDiscountedProducts();
    }
  }

  onSearchInputChange(keyword: string): void {
    if (keyword.trim() !== '') {
      this.searchSubject.next(keyword);
    } else {
      this.fetchProducts();
    }
  }

  goToSuggestedPage(page: number): void {
    if (page >= 1 && page <= this.totalSuggestedPages) {
      this.currentSuggestedPage = page;
      this.paginateSuggestedProducts();
    }
  }

  getLowestPrice(product: Product): number {
    if (product.productOptions?.length) {
      const prices = product.productOptions.map(option => option.giaSp).filter(price => price !== null && price !== undefined && !isNaN(price));
      return prices.length ? Math.min(...prices) : 0;
    }
    return 0;
  }

  getLowestDiscountedPrice(product: Product): number {
    if (product.productOptions?.length) {
      const discountedPrices = product.productOptions.map(option => option.giaSauKhuyenMai).filter(price => price !== null && price !== undefined && !isNaN(price));
      return discountedPrices.length ? Math.min(...discountedPrices) : 0;
    }
    return 0;
  }


  getHighestDiscount(product: Product): number {
    return product.productOptions?.length
      ? Math.max(...product.productOptions.map(option => option.khuyenMai))
      : 0;
  }

  formatPrice(price: number): string {
    return isNaN(price) ? 'NaN' : `${price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
  }

  viewProduct(id: number): void {
    this.router.navigate(['/home/product', id]);
  }


  isPriceAscending: boolean = true;  // Biến điều khiển sắp xếp theo giá (tăng dần hoặc giảm dần)

  // Các hàm hiện có không thay đổi...

  // Hàm sắp xếp sản phẩm theo giá từ thấp đến cao
  sortByPriceAsc(): void {
    this.paginatedAllProducts = [...this.paginatedAllProducts].sort((a, b) => {
      return this.getLowestPrice(a) - this.getLowestPrice(b);
    });
    this.isPriceAscending = true;
  }

  // Hàm sắp xếp sản phẩm theo giá từ cao đến thấp
  sortByPriceDesc(): void {
    this.paginatedAllProducts = [...this.paginatedAllProducts].sort((a, b) => {
      return this.getLowestPrice(b) - this.getLowestPrice(a);
    });
    this.isPriceAscending = false;
  }

  // Hàm gọi khi click vào mũi tên lên
  onPriceAscClick(): void {
    this.sortByPriceAsc();
  }

  // Hàm gọi khi click vào mũi tên xuống
  onPriceDescClick(): void {
    this.sortByPriceDesc();
  }



  paginateAllProducts() {
    const startIndex = (this.currentAllPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAllProducts = this.products.slice(startIndex, endIndex);
  }

  // Hàm đi đến trang cụ thể
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalAllPages) {
      this.currentAllPage = page;
      this.paginateAllProducts();
    }
  }


}
