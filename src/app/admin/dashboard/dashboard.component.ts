import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { UserData } from '../../model/userData.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, startWith, switchMap } from 'rxjs/operators';
import { Product, ProductCategory, ProductOption } from '../../model/product.model';
import { ProductService } from '../../../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Voucher } from '../../model/voucher.model';
import { formatDate } from '@angular/common';
import { Order, OrderItem } from '../../model/myOrder.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errorMessage: string = '';
  isDeleteProductVisible = false;
  productName = new FormControl('');
  productOS = new FormControl('');
  productInfo = new FormControl('');
  productWeight = new FormControl('');
  productScreen = new FormControl('');
  productMemory = new FormControl('');
  productSim = new FormControl('');
  productCharger = new FormControl('');
  productCamera = new FormControl('');
  productSecurity = new FormControl('');
  productBattery = new FormControl('');
  productWarranty = new FormControl('');
  isAddCategoryFormVisible = false;
  isDelCategoryFormVisible = false;
  isEditCategoryFormVisible = false;
  isEditProductCategoryFormVisible = false;
  isAddProductFormVisible: boolean = false;
  showVoucherContent = false;
  isAddProductOptionFormVisible: boolean = false;
  searchControl = new FormControl('');
  selectedUser: UserData | null = null;
  users: UserData[] = [];
  isFormVisible = false;
  showDashboardContent = true;
  showMyStoreContent = false;
  showOrderContent = false;
  showAddForm = false;
  showProductDetailContent = false;
  selectedItem: string = 'dashboard';
  userId: string | null = null;
  userName: string | null = null;
  newCategoryName = new FormControl('');
  selectedCategory: ProductCategory | null = null;
  selectedProduct: Product | null = null;
  productCategoryName = new FormControl('');
  selectedProductIdToDelete: number | null = null;

  // Modal xóa
  isDeleteModalVisible = false;
  userToDelete: UserData | null = null;
  newProduct: FormGroup;
  constructor(private userService: UserService, private router: Router,
    private productService: ProductService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient

  ) {
    this.newProduct = this.fb.group({
      tenSp: new FormControl('', Validators.required),
      thongTinSp: new FormControl('', Validators.required),
      linkAnh: new FormControl('', Validators.required),
      trongLuong: new FormControl('', Validators.required),
      manHinh: new FormControl('', Validators.required),
      boNho: new FormControl('', Validators.required),
      theSim: new FormControl('', Validators.required),
      heDieuHanh: new FormControl('', Validators.required),
      congSac: new FormControl('', Validators.required),
      camera: new FormControl('', Validators.required),
      baoMat: new FormControl('', Validators.required),
      pin: new FormControl('', Validators.required),
      baoHanh: new FormControl('', Validators.required),
      soSaoTrungBinh: new FormControl(0, Validators.required),
      soLuotDanhGia: new FormControl(0, Validators.required),
      soLuotBinhLuan: new FormControl(0, Validators.required),
      productCategory: this.fb.group({ idDm: new FormControl('', Validators.required), tenDm: new FormControl('') }),
      productOptions: this.fb.array([this.createProductOption()])
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('idKh');
    this.userName = localStorage.getItem('tenKh');

    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(query =>
        query ? this.userService.searchUsers(query) : this.userService.getAllUsers()
      )
    ).subscribe((data: UserData[]) => {
      this.users = data;
    }, error => {
      console.error('Error:', error);
    });

    // Load initial list of users
    this.userService.getAllUsers().subscribe((data: UserData[]) => {
      this.users = data;
    }, error => {
      console.error('Error:', error);
    });



    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      filter((keyword: string | null): keyword is string => keyword !== null && keyword.trim() !== ''),
      switchMap((keyword: string) => this.productService.searchProducts(keyword))
    ).subscribe((data: Product[]) => {
      this.filteredProducts = data;
    }, error => {
      console.error('Error searching products:', error);
    });
    this.loadAllProducts();
    this.loadProductCategories();
    this.getAllVouchers();
    this.getAllOrders();

    this.searchControl.valueChanges.subscribe(value => this.filterOrders(value ?? ''));
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
  }

  DisplayForm() {
    this.isFormVisible = !this.isFormVisible;
  }

  showDashboard(event: Event) {
    event.preventDefault();
    this.showDashboardContent = true;
    this.showMyStoreContent = false;
    this.showProductDetailContent = false;
    this.showVoucherContent = false;
    this.showOrderContent = false;
  }

  showMyStore(event: Event) {
    event.preventDefault();
    this.showDashboardContent = false;
    this.showMyStoreContent = true;
    this.showProductDetailContent = false;
    this.showVoucherContent = false;
    this.showOrderContent = false;
  }

  showMyProduct(event: Event) {
    event.preventDefault();
    this.showDashboardContent = false;
    this.showMyStoreContent = false;
    this.showProductDetailContent = true;
    this.showVoucherContent = false;
    this.showOrderContent = false;
  }

  showVoucherProduct(event: Event) {
    event.preventDefault();
    this.showDashboardContent = false;
    this.showMyStoreContent = false;
    this.showProductDetailContent = false;
    this.showVoucherContent = true;
    this.showOrderContent = false;
  }

  showOrderProduct(event: Event) {
    event.preventDefault();
    this.showDashboardContent = false;
    this.showMyStoreContent = false;
    this.showProductDetailContent = false;
    this.showVoucherContent = false;
    this.showOrderContent = true;
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.filteredProducts = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  toggleAddProductForm(): void { this.isAddProductFormVisible = !this.isAddProductFormVisible; }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('idKh');
    localStorage.removeItem('tenKh');
    this.router.navigate(['/admin/login']);
  }

  onCancelEdit(): void {
    this.selectedUser = null;
  }

  selectItem(item: string): void {
    this.selectedItem = item;
  }

  // Chỉnh sửa thông tin user
  editUser(user: UserData): void {
    this.selectedUser = user;
  }

  onUserUpdated(updatedUser: UserData): void {
    const index = this.users.findIndex(user => user.idKh === updatedUser.idKh);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
    this.selectedUser = null;
  }

  // Xử lý xóa người dùng
  confirmDelete(user: UserData): void {
    this.userToDelete = user;
    this.isDeleteModalVisible = true;
  }

  deleteUser(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.idKh).subscribe(() => {
        this.users = this.users.filter(user => user.idKh !== this.userToDelete?.idKh);
        this.isDeleteModalVisible = false;
        this.userToDelete = null;
      }, error => {
        console.error('Error:', error);
      });
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.userToDelete = null;
  }




  productCategories: ProductCategory[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: number | null = null;




  loadProductCategories(): void {
    this.productService.getProductCategories().subscribe({
      next: (categories: ProductCategory[]) => {
        console.log('Loaded categories:', categories); // Kiểm tra dữ liệu
        this.productCategories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  getAllProducts(): Product[] {
    let allProducts: Product[] = [];
    this.productCategories.forEach(category => {
      allProducts = [...allProducts, ...(category.products || [])];
    });
    return allProducts;
  }


  onCategorySelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = target.value;
    const id = parseInt(categoryId, 10);

    const selectedCategory = this.productCategories.find(category => category.idDm === id);
    if (selectedCategory) {
      this.newProduct.get('productCategory')?.get('idDm')?.setValue(selectedCategory.idDm);
      this.newProduct.get('productCategory')?.get('tenDm')?.setValue(selectedCategory.tenDm);
    }
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = target.value;
    const id = parseInt(categoryId, 10);
    if (id === 0) {
      this.filteredProducts = this.getAllProducts();
      this.loadAllProducts();
    } else {
      const selectedCategory = this.productCategories.find(category => category.idDm === id);
      this.filteredProducts = selectedCategory ? selectedCategory.products || [] : [];
    }
  }

  toggleDelCategoryForm(): void {
    console.log('Toggling form visibility'); // Log khi toggling
    this.isDelCategoryFormVisible = !this.isDelCategoryFormVisible;
  }
  toggleAddCategoryForm(): void { this.isAddCategoryFormVisible = !this.isAddCategoryFormVisible; }
  toggleDelProductCategoryForm(): void { this.isDeleteProductVisible = !this.isDeleteProductVisible; }
  toggleEditCategoryForm(): void { this.isEditCategoryFormVisible = !this.isEditCategoryFormVisible; }
  toggleEditProductCategoryForm(): void { this.isEditProductCategoryFormVisible = !this.isEditProductCategoryFormVisible; }
  addCategory(): void {
    const categoryName = this.newCategoryName.value;
    if (categoryName && categoryName.trim() !== '') {
      this.productService.addCategory(categoryName).subscribe({
        next: (newCategory: ProductCategory) => { this.productCategories.push(newCategory); this.newCategoryName.reset(); this.toggleAddCategoryForm(); }, error: (error) => { console.error('Error adding category:', error); }
      });
    }
  }

  removeProductOption(index: number): void { this.productOptions.removeAt(index); }

  updateCategory(): void {
    const categoryName = this.newCategoryName.value;
    if (this.selectedCategory && categoryName && categoryName.trim() !== '') {
      this.productService.updateCategory(this.selectedCategory.idDm, categoryName).subscribe({
        next: (updatedCategory: ProductCategory) => { const index = this.productCategories.findIndex(cat => cat.idDm === updatedCategory.idDm); if (index !== -1) { this.productCategories[index] = updatedCategory; } this.newCategoryName.reset(); this.selectedCategory = null; this.toggleEditCategoryForm(); }, error: (error) => { console.error('Error updating category:', error); }
      });
    }
  }

  onCategorySelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = parseInt(target.value, 10);
    this.selectedCategory = this.productCategories.find(category => category.idDm === categoryId) || null;
    if (this.selectedCategory) { this.newCategoryName.setValue(this.selectedCategory.tenDm); }
  }

  deleteCategory(): void {
    if (this.selectedCategory) {
      this.productService.deleteCategory(this.selectedCategory.idDm).subscribe({
        next: (response) => {
          this.toastr.success("Xoá thành công")
          this.productCategories = this.productCategories.filter(
            (cat) => cat.idDm !== this.selectedCategory?.idDm
          );
          this.newCategoryName.reset();
          this.selectedCategory = null;
          this.toggleDelCategoryForm();
        },
        error: (error) => {
          if (error.status === 400 && error.error) {
            this.toastr.error("Không thể xoá vì danh mục có sản phẩm") // In thông báo lỗi từ backend
          } else {
            this.toastr.error("Không thể xoá vì danh mục có sản phẩm")
          }
        },
      });
    }
  }




  editProductCategory(productId: number): void {
    this.productService.getProductById(productId.toString()).subscribe({
      next: (product: Product) => {
        this.selectedProduct = product;
        this.productCategoryName.setValue(product.productCategory.tenDm);
        this.productName.setValue(product.tenSp);
        this.productOS.setValue(product.heDieuHanh);
        this.productInfo.setValue(product.thongTinSp);
        this.productWeight.setValue(product.trongLuong.toString());
        this.productScreen.setValue(product.manHinh);
        this.productMemory.setValue(product.boNho);
        this.productSim.setValue(product.theSim);
        this.productCharger.setValue(product.congSac);
        this.productCamera.setValue(product.camera);
        this.productSecurity.setValue(product.baoMat);
        this.productBattery.setValue(product.pin);
        this.productWarranty.setValue(product.baoHanh);
        this.toggleEditProductCategoryForm();
      },
      error: (error) => {
        console.error('Error fetching product by id:', error);
      }
    });
  }




  productImageLink = new FormControl('', Validators.required);
  updateProduct(): void {
    if (this.selectedProduct) {
      const updatedProduct: Product = {
        ...this.selectedProduct,
        tenSp: this.productName.value ?? this.selectedProduct.tenSp,
        heDieuHanh: this.productOS.value ?? this.selectedProduct.heDieuHanh,
        thongTinSp: this.productInfo.value ?? this.selectedProduct.thongTinSp,
        trongLuong: parseFloat(this.productWeight.value!) ?? this.selectedProduct.trongLuong, // Chuyển đổi chuỗi sang số
        manHinh: this.productScreen.value ?? this.selectedProduct.manHinh,
        boNho: this.productMemory.value ?? this.selectedProduct.boNho,
        theSim: this.productSim.value ?? this.selectedProduct.theSim,
        congSac: this.productCharger.value ?? this.selectedProduct.congSac,
        camera: this.productCamera.value ?? this.selectedProduct.camera,
        baoMat: this.productSecurity.value ?? this.selectedProduct.baoMat,
        pin: this.productBattery.value ?? this.selectedProduct.pin,
        baoHanh: this.productWarranty.value ?? this.selectedProduct.baoHanh,
        linkAnh: this.productImageLink.value ? this.productImageLink.value : this.selectedProduct?.linkAnh,
        productCategory: {
          ...this.selectedProduct.productCategory,
          tenDm: this.productCategoryName.value ?? this.selectedProduct.productCategory.tenDm
        }
      };

      this.productService.updateProductById(updatedProduct.idSp.toString(), updatedProduct).subscribe({
        next: (product: Product) => {
          this.toggleEditProductCategoryForm();
          this.loadAllProducts();
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    }
  }

  uploadImage1(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      this.http.post(`https://api.imgbb.com/1/upload?key=${this.imgbbAPIKey}`, formData).subscribe((response: any) => {
        if (response.success) {
          this.productImageLink.setValue(response.data.url);
          console.log('Product image uploaded successfully', response.data.url);
        }
      });
    }
  }


  onProductCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCategory = this.productCategories.find(category => category.tenDm === target.value);
    if (selectedCategory) {
      this.productCategoryName.setValue(selectedCategory.tenDm);
    }
  }

  productDetails: any = null;

  confirmDeleteProduct(productId: number) {
    this.selectedProductIdToDelete = productId;
    this.http.get(`http://localhost:8080/api/v1/product/${productId}`).subscribe((product: any) => {
      this.productDetails = product;
      this.isDeleteProductVisible = true;
    });
  }
  orderDetails: any[] = [];



  deleteProduct(): void {
    if (this.selectedProductIdToDelete !== null) {
      this.http.delete(`http://localhost:8080/api/v1/product/delete/${this.selectedProductIdToDelete}`).subscribe({
        next: (response) => {
          console.log('Product deleted:', response);
          this.filteredProducts = this.filteredProducts.filter(product => product.idSp !== this.selectedProductIdToDelete);
          this.toggleDelProductCategoryForm();
          alert('Sản phẩm đã được xóa.');
        },
        error: (error) => {
          if (error.status === 400 && error.error) {
            console.error('Error deleting product:', error.error); // In thông báo lỗi cụ thể từ backend
            this.orderDetails = error.error; // Lưu trữ thông tin đơn hàng
            this.isDeleteProductVisible = true; // Hiển thị modal với thông tin đơn hàng
          } else {
            console.error('Error deleting product:', error);
          }
        }
      });
    }
  }

  get productOptions(): FormArray { return this.newProduct.get('productOptions') as FormArray; }

  createProductOption(): FormGroup {
    return this.fb.group({
      mauSac: new FormControl('', Validators.required),
      dungLuong: new FormControl('', Validators.required),
      linkMauAnhSp: new FormControl('', Validators.required),
      giaSp: new FormControl('', Validators.required),
      khuyenMai: new FormControl('', Validators.required),
      soLuong: new FormControl('', Validators.required)
    });
  }

  addProductOption(): void {
    this.productOptions.push(this.createProductOption());
  }


  checkFormValidity(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        console.log(`${key} is ${control.invalid ? 'invalid' : 'valid'}`, control.errors);
      } else if (control instanceof FormGroup) {
        this.checkFormValidity(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((ctrl, index) => {
          if (ctrl instanceof FormGroup) {
            this.checkFormValidity(ctrl);
          } else {
            console.log(`FormArray ${key}[${index}] is ${ctrl.invalid ? 'invalid' : 'valid'}`, ctrl.errors);
          }
        });
      }
    });
  }


  getNestedFormControl(parentName: string, childName: string): FormControl { const parent = this.newProduct.get(parentName); if (!parent || !parent.get(childName)) { throw new Error(`FormControl ${parentName}.${childName} not found`); } return parent.get(childName) as FormControl; }
  getFormControl(name: string): FormControl {
    const control = this.newProduct.get(name);
    if (!control) { throw new Error(`FormControl ${name} not found`); } return control as FormControl;
  }
  addProduct(): void {
    if (this.newProduct.valid) {
      const product = this.newProduct.value;
      console.log(JSON.stringify(product, null, 2));
      this.productService.createProduct(product).subscribe({
        next: (response) => {
          console.log('Product added successfully', response);
          this.toggleAddProductForm();
          this.resetForm(); // Reset form sau khi thêm thành công
          this.loadAllProducts()
          this.toastr.success("Thêm sản phẩm thành công !", "Success!")
        },
        error: (error) => {
          this.errorMessage = error;
          console.error('Error adding product', error);
        }
      });
    } else {
      this.markAllAsTouched();
      this.checkFormValidity(this.newProduct);
      console.error('Form is invalid', this.newProduct);
      this.toastr.error("Bạn chưa điền đầy đủ thông tin !", "Error!")

    }
  }

  resetForm(): void {
    this.newProduct.reset();
    this.productOptions.clear();
    this.productOptions.push(this.createProductOption()); // Đảm bảo form có ít nhất một tùy chọn sản phẩm
  }


  markAllAsTouched(): void {
    this.newProduct.markAllAsTouched();
    this.productOptions.controls.forEach(control => control.markAsTouched());
  }

  uploadPercent: Observable<number> | null = null;
  downloadURL: string | null = null;
  imgbbAPIKey: string = '1b8530d1464fa7ca58cf2f8c71c3ad63';

  uploadImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      this.http.post(`https://api.imgbb.com/1/upload?key=${this.imgbbAPIKey}`, formData).subscribe((response: any) => {
        if (response.success) {
          this.newProduct.get('linkAnh')?.setValue(response.data.url);
          console.log('Image uploaded successfully', response.data.url);
        }
      });
    }
  }

  uploadOptionImage(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      this.http.post(`https://api.imgbb.com/1/upload?key=${this.imgbbAPIKey}`, formData).subscribe((response: any) => {
        if (response.success) {
          (this.productOptions.at(index) as FormGroup).get('linkMauAnhSp')?.setValue(response.data.url);
          console.log('Option image uploaded successfully', response.data.url);
        }
      });
    }
  }

  optionColor = new FormControl('', Validators.required);
  optionImageLink = new FormControl('', Validators.required);
  optionStorage = new FormControl('', Validators.required);
  optionPrice = new FormControl('', Validators.required);
  optionDiscount = new FormControl('', Validators.required);
  optionQuantity = new FormControl('', Validators.required);
  optionFinalPrice = new FormControl('', Validators.required);

  toggleAddProductOptionForm(): void { this.isAddProductOptionFormVisible = !this.isAddProductOptionFormVisible; }

  uploadNewOptionImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];
      const formData = new FormData(); formData.append('image', file);
      this.http.post(`https://api.imgbb.com/1/upload?key=${this.imgbbAPIKey}`, formData).subscribe((response: any) => {
        if (response.success) { this.optionImageLink.setValue(response.data.url); console.log('Option image uploaded successfully', response.data.url); }
      });
    }
  }




  addProductOption1(): void {
    if (this.optionColor.valid && this.optionImageLink.valid && this.optionStorage.valid &&
      this.optionPrice.valid && this.optionDiscount.valid && this.optionQuantity.valid) {

      if (this.selectedProduct) {  // Kiểm tra xem selectedProduct không phải là null
        const newOption: ProductOption = {
          idTuyChon: 0,  // Sử dụng giá trị mặc định là 0
          mauSac: this.optionColor.value!,
          linkMauAnhSp: this.optionImageLink.value!,
          dungLuong: this.optionStorage.value!,
          giaSp: Number(this.optionPrice.value),
          khuyenMai: Number(this.optionDiscount.value),
          soLuong: Number(this.optionQuantity.value),
          giaSauKhuyenMai: Number(this.optionFinalPrice.value)  // Bạn có thể tính toán giá sau khuyến mãi nếu cần thiết
        };

        this.productService.createProductOption(this.selectedProduct.idSp, newOption).subscribe({
          next: (response) => {
            console.log('Product option added successfully', response);
            this.toggleAddProductOptionForm();
            // Reset form
            this.optionColor.reset();
            this.optionImageLink.reset();
            this.optionStorage.reset();
            this.optionPrice.reset();
            this.optionDiscount.reset();
            this.optionQuantity.reset();
            this.optionFinalPrice.reset();
            this.loadAllProducts();
          },
          error: (error) => {
            console.error('Error adding product option', error);
          }
        });
      } else {
        console.error('Selected product is null');
      }
    } else {
      console.error('Form is invalid');
    }
  }

  prepareAddProductOption(product: Product): void { this.selectedProduct = product; this.toggleAddProductOptionForm(); }

  isDeleteProductVisible1 = false;
  selectedProductOptionId: number | null = null;

  toggleDelProductCategoryForm1(): void { this.isDeleteProductVisible1 = !this.isDeleteProductVisible1; }

  confirmDeleteProductOption(optionId: number): void { this.selectedProductOptionId = optionId; this.toggleDelProductCategoryForm1(); }

  deleteProductOption(): void {
    if (this.selectedProductOptionId !== null) {
      this.productService.deleteProductOption(this.selectedProductOptionId).subscribe({
        next: () => {
          console.log('Product option deleted successfully');
          this.toggleDelProductCategoryForm1();
          this.toastr.success("Xoá thành công !")
          this.getAllProducts();
          this.loadAllProducts()
        },
        error: (error) => {
          console.error('Error deleting product option', error);
        }
      });
    } else {
      console.error('No product option selected for deletion');
    }
  }

  // Sửa option

  isEditProductOptionFormVisible = false;
  selectedProductOption: ProductOption | null = null;

  toggleEditProductOptionForm(): void {
    this.isEditProductOptionFormVisible = !this.isEditProductOptionFormVisible;
  }

  editProductOption(option: ProductOption): void {
    this.selectedProductOption = option;
    this.optionColor.setValue(option.mauSac);
    this.optionImageLink.setValue(option.linkMauAnhSp);
    this.optionStorage.setValue(option.dungLuong);
    this.optionPrice.setValue(option.giaSp.toString()); // Chuyển đổi giá trị sang chuỗi
    this.optionDiscount.setValue(option.khuyenMai.toString()); // Chuyển đổi giá trị sang chuỗi
    this.optionQuantity.setValue(option.soLuong.toString()); // Chuyển đổi giá trị sang chuỗi
    this.toggleEditProductOptionForm();
  }


  updateProductOption(): void {
    if (this.selectedProductOption) {
      const updatedOption: ProductOption = {
        idTuyChon: this.selectedProductOption.idTuyChon,
        mauSac: this.optionColor.value!,
        linkMauAnhSp: this.optionImageLink.value ? this.optionImageLink.value : this.selectedProductOption.linkMauAnhSp,  // Kiểm tra xem có link ảnh mới hay không
        dungLuong: this.optionStorage.value!,
        giaSp: Number(this.optionPrice.value!),  // Chuyển đổi giá trị sang số
        khuyenMai: Number(this.optionDiscount.value!),  // Chuyển đổi giá trị sang số
        soLuong: Number(this.optionQuantity.value!),  // Chuyển đổi giá trị sang số
        giaSauKhuyenMai: this.selectedProductOption.giaSauKhuyenMai  // Giữ nguyên giá trị giaSauKhuyenMai
      };

      this.productService.updateProductOption(updatedOption.idTuyChon, updatedOption).subscribe({
        next: (response) => {
          console.log('Product option updated successfully', response);
          this.toggleEditProductOptionForm();
          // Cập nhật lại danh sách sản phẩm sau khi chỉnh sửa thành công
          this.loadAllProducts();

        },
        error: (error) => {
          console.error('Error updating product option', error);
        }
      });
    }
  }



  isEditVoucherFormVisible = false;
  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];
  selectedVoucher: Voucher | null = null;

  voucherCode = new FormControl('', Validators.required);
  voucherDescription = new FormControl('', Validators.required);
  voucherValue = new FormControl('', Validators.required);
  voucherType = new FormControl('', Validators.required);
  voucherStartDate = new FormControl('', Validators.required);
  voucherEndDate = new FormControl('', Validators.required);
  voucherCondition = new FormControl('', Validators.required);
  voucherQuantity = new FormControl('', Validators.required);
  getAllVouchers(): void {
    this.http.get<Voucher[]>('http://localhost:8080/api/v1/voucher').subscribe({
      next: (vouchers: Voucher[]) => {
        this.vouchers = vouchers;
        this.filteredVouchers = vouchers;
      },
      error: (error) => {
        console.error('Error fetching vouchers:', error);
      }
    });
  }

  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
  }

  getRemainingDays(endDateString: string): string {
    const today = new Date();
    const endDate = new Date(endDateString);
    const differenceInTime = endDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays > 0) {
      return `(còn ${differenceInDays} ngày nữa)`;
    } else if (differenceInDays === 0) {
      return `(hôm nay là hạn cuối)`;
    } else {
      return `(đã hết hạn)`;
    }
  }


  editVoucher(voucher: Voucher): void {
    this.selectedVoucher = voucher;
    this.voucherCode.setValue(voucher.maVoucher);
    this.voucherDescription.setValue(voucher.moTa);
    this.voucherValue.setValue(voucher.giaTri.toString());
    this.voucherType.setValue(voucher.loaiVoucher);
    this.voucherStartDate.setValue(voucher.ngayBatDau);
    this.voucherEndDate.setValue(voucher.ngayKetThuc);
    this.voucherCondition.setValue(voucher.dieuKienSuDung.toString());
    this.voucherQuantity.setValue(voucher.soLuong.toString());
    this.toggleEditVoucherForm();
  }

  toggleEditVoucherForm(): void {
    this.isEditVoucherFormVisible = !this.isEditVoucherFormVisible;
  }

  updateVoucher(): void {
    if (this.selectedVoucher) {
      const updatedVoucher: Voucher = {
        ...this.selectedVoucher,
        maVoucher: this.voucherCode.value!,
        moTa: this.voucherDescription.value!,
        giaTri: parseFloat(this.voucherValue.value!),
        loaiVoucher: this.voucherType.value!,
        ngayBatDau: this.voucherStartDate.value!,
        ngayKetThuc: this.voucherEndDate.value!,
        dieuKienSuDung: parseFloat(this.voucherCondition.value!),
        soLuong: parseFloat(this.voucherQuantity.value!)
      };

      this.http.put<Voucher>(`http://localhost:8080/api/v1/voucher/${updatedVoucher.idVoucher}`, updatedVoucher).subscribe({
        next: (response) => {
          console.log('Voucher updated successfully', response);
          this.toggleEditVoucherForm();
          this.getAllVouchers();
        },
        error: (error) => {
          console.error('Error updating voucher:', error);
        }
      });
    }
  }

  deleteVoucher(voucherId: number): void {
    this.http.delete(`http://localhost:8080/api/v1/voucher/${voucherId}`).subscribe({
      next: () => {
        console.log('Voucher deleted successfully');
        this.getAllVouchers();
      },
      error: (error) => {
        console.error('Error deleting voucher:', error);
      }
    });
  }

  deleteProduct1(productId: number): void {
    this.http.delete(`http://localhost:8080/api/v1/voucher/${productId}`).subscribe({
      next: () => {
        console.log('Voucher deleted successfully');
        this.getAllVouchers();
      },
      error: (error) => {
        console.error('Error deleting voucher:', error);
      }
    });
  }

  isAddVoucherFormVisible = false;

  newVoucherCode = new FormControl('', Validators.required);
  newVoucherDescription = new FormControl('', Validators.required);
  newVoucherValue = new FormControl('', Validators.required);
  newVoucherType = new FormControl('', Validators.required);
  newVoucherStartDate = new FormControl('', Validators.required);
  newVoucherEndDate = new FormControl('', Validators.required);
  newVoucherCondition = new FormControl('', Validators.required);
  newVoucherQuantity = new FormControl('', Validators.required);
  openAddVoucherForm(): void {
    this.newVoucherCode.reset();
    this.newVoucherDescription.reset();
    this.newVoucherValue.reset();
    this.newVoucherType.reset();
    this.newVoucherStartDate.reset();
    this.newVoucherEndDate.reset();
    this.newVoucherCondition.reset();
    this.newVoucherQuantity.reset();
    this.isAddVoucherFormVisible = true;
  }

  toggleAddVoucherForm(): void {
    this.isAddVoucherFormVisible = !this.isAddVoucherFormVisible;
  }

  addVoucher(): void {
    const newVoucher: Voucher = {
      idVoucher: 0, // idVoucher sẽ được backend tự động gán
      maVoucher: this.newVoucherCode.value!,
      moTa: this.newVoucherDescription.value!,
      giaTri: parseFloat(this.newVoucherValue.value!), // Chuyển đổi giá trị thành số
      loaiVoucher: this.newVoucherType.value!,
      ngayBatDau: this.newVoucherStartDate.value!,
      ngayKetThuc: this.newVoucherEndDate.value!,
      dieuKienSuDung: parseFloat(this.newVoucherCondition.value!), // Chuyển đổi giá trị thành số
      soLuong: parseInt(this.newVoucherQuantity.value!, 10) // Chuyển đổi giá trị thành số nguyên
    };

    this.http.post<Voucher>('http://localhost:8080/api/v1/voucher', newVoucher).subscribe({
      next: (response) => {
        console.log('Voucher added successfully', response);
        this.toggleAddVoucherForm();
        this.getAllVouchers();
      },
      error: (error) => {
        console.error('Error adding voucher:', error);
      }
    });
  }


  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any | null = null;

  getAllOrders(): void {
    this.http.get<any[]>('http://localhost:8080/api/v1/order/all').subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.calculateOrderCounts();
        console.log(this.orders);
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  calculateOrderCounts(): void {
    this.totalOrders = this.orders.length;
    this.pendingOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Pending').length;
    this.processingOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Processing').length;
    this.shippedOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Shipped').length;
    this.deliveredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Delivered').length;
    this.canceledOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Cancel').length;
    this.returnedOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Return').length;
    this.displayedOrdersCount = this.totalOrders;
  }

  filterOrders(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order =>
        order.maDonHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item: OrderItem) => item.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }

  toggleLocation(order: Order): void {
    order.showLocation = !order.showLocation;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Đơn mới';
      case 'Processing':
        return 'Đang gói hàng';
      case 'Shipped':
        return 'Đang vận chuyển';
      case 'Delivered':
        return 'Đã giao hàng';
      case 'Cancel':
        return 'Đã huỷ';
      case 'Return':
        return 'Đã trả hàng';
      default:
        return status;
    }
  }

  filterByStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const status = selectElement.value;

    switch (status) {
      case 'all':
        this.filteredOrders = this.orders;
        this.displayedOrdersCount = this.totalOrders;
        this.displayedOrdersLabel = 'Tổng đơn hàng';
        break;
      case 'Pending':
        this.filteredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Pending');
        this.displayedOrdersCount = this.pendingOrders;
        this.displayedOrdersLabel = 'Đơn mới';
        break;
      case 'Processing':
        this.filteredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Processing');
        this.displayedOrdersCount = this.processingOrders;
        this.displayedOrdersLabel = 'Đang gói hàng';
        break;
      case 'Shipped':
        this.filteredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Shipped');
        this.displayedOrdersCount = this.shippedOrders;
        this.displayedOrdersLabel = 'Đang vận chuyển';
        break;
      case 'Delivered':
        this.filteredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Delivered');
        this.displayedOrdersCount = this.deliveredOrders;
        this.displayedOrdersLabel = 'Đã giao hàng';
        break;
      case 'Cancel':
        this.filteredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Cancel');
        this.displayedOrdersCount = this.canceledOrders;
        this.displayedOrdersLabel = 'Đã huỷ';
        break;
      case 'Return':
        this.filteredOrders = this.orders.filter(order => order.tinhTrang.tinhTrang === 'Return');
        this.displayedOrdersCount = this.returnedOrders;
        this.displayedOrdersLabel = 'Đã trả hàng';
        break;
      default:
        this.filteredOrders = this.orders;
        this.displayedOrdersCount = this.totalOrders;
        this.displayedOrdersLabel = 'Tổng đơn hàng';
        break;
    }
  }

  editOrder(order: Order): void {
    order.isEditing = true;
  }

  saveOrder(order: Order): void {
    const statusMap: { [key: string]: { idTinhTrang: number, tinhTrang: string } } = {
      'Pending': { idTinhTrang: 1, tinhTrang: 'Pending' },
      'Processing': { idTinhTrang: 2, tinhTrang: 'Processing' },
      'Shipped': { idTinhTrang: 3, tinhTrang: 'Shipped' },
      'Delivered': { idTinhTrang: 4, tinhTrang: 'Delivered' },
      'Cancel': { idTinhTrang: 5, tinhTrang: 'Cancel' },
      'Return': { idTinhTrang: 6, tinhTrang: 'Return' }
    };

    const updatedOrder = {
      ...order,
      tinhTrang: statusMap[order.tinhTrang.tinhTrang]
    };

    this.http.put<Order>(`http://localhost:8080/api/v1/order/update/${order.idDdh}`, updatedOrder).subscribe({
      next: (response: Order) => {
        // Cập nhật trạng thái đơn hàng trong frontend
        const index = this.orders.findIndex(o => o.idDdh === order.idDdh);
        if (index !== -1) {
          this.orders[index] = response;
          this.filteredOrders = [...this.orders]; // Cập nhật danh sách đơn hàng đã lọc
          this.getAllOrders()
        }
        order.isEditing = false;
        console.log('Order updated successfully');
      },
      error: (error) => {
        console.error('Error updating order:', error);
      }
    });
  }

  deleteOrder(order: Order): void {
    this.http.delete(`http://localhost:8080/api/v1/order/delete/${order.idDdh}`, { responseType: 'text' }).subscribe({
      next: () => {
        // Xóa đơn hàng khỏi danh sách
        this.orders = this.orders.filter(o => o.idDdh !== order.idDdh);
        this.filteredOrders = this.filteredOrders.filter(o => o.idDdh !== order.idDdh);
        console.log('Order deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting order:', error);
      }
    });
  }


  totalOrders: number = 0;
  pendingOrders: number = 0;
  processingOrders: number = 0;
  shippedOrders: number = 0;
  deliveredOrders: number = 0;
  canceledOrders: number = 0;
  returnedOrders: number = 0;
  displayedOrdersCount: number = 0;
  displayedOrdersLabel: string = 'Tổng đơn hàng';



  showEmailForm = false;
  toggleEmailForm(order: Order) {
    order.showEmailForm = !order.showEmailForm;
  }

  emailContent: string = '';
  submitEmail(order: Order) {
    const formData = new FormData();
    formData.append('content', this.emailContent);
    formData.append('subject', ''); // Gửi subject rỗng

    console.log(this.emailContent); // Kiểm tra nội dung email

    this.http.post(`http://localhost:8080/api/v1/mail/send-to-user/${order.idKh}`, formData, { responseType: 'text' })
      .subscribe(response => {
        console.log('Email sent successfully', response);
        this.toggleEmailForm(order); // Close the form after submission
      }, error => {
        console.error('Error sending email', error);
      });
  }
}  
