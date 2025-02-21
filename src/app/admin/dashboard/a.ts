// Chắc chắn rồi! Bạn có thể cập nhật phương thức `deleteProduct` để hiển thị thông tin đơn hàng trong modal thay vì sử dụng`alert`.Dưới đây là cách bạn có thể làm điều đó:

// 1. ** Cập nhật phương thức `deleteProduct` để lưu trữ thông tin đơn hàng và hiển thị trong modal:**

//     ```typescript

// ```

// 2. ** Cập nhật HTML để hiển thị thông tin đơn hàng trong modal:**


//     <div class="modal-box" * ngIf="isDeleteProductVisible" >
//         <div class="modal-switch" >
//             <h2>Bạn có muốn xóa ? </h2>
//                 < div * ngIf="orderDetails.length > 0" >
//                     <h3>Sản phẩm đang có đơn hàng chi tiết như sau: </h3>
//                         < div * ngFor="let orderDetail of orderDetails" >
//                             <span><strong>Mã đơn hàng: </strong> {{ orderDetail.idDdh }}</span > <br>
//                                 <span><strong>Số lượng mua: </strong> {{ orderDetail.soLuongMua }}</span > <br>
//                                     <span><strong>Đơn giá: </strong> {{ orderDetail.donGia | currency }}</span > <br>
//                                         <span><strong>Màu sắc: </strong> {{ orderDetail.tuyChonSanPham.mauSac }}</span > <br>
//                                             <span><strong>Dung lượng: </strong> {{ orderDetail.tuyChonSanPham.dungLuong }}</span > <br>
//                                                 <span><strong>Giá sản phẩm: </strong> {{ orderDetail.tuyChonSanPham.giaSp | currency }}</span > <br>
//                                                     <span><strong>Khuyến mãi: </strong> {{ orderDetail.tuyChonSanPham.khuyenMai | currency }}</span > <br>
//                                                         <span><strong>Số lượng: </strong> {{ orderDetail.tuyChonSanPham.soLuong }}</span > <br>
//                                                             <img[src]="orderDetail.tuyChonSanPham.linkMauAnhSp" alt = "Product Image" width = "100" >
//                                                                 </div>
//                                                                 </div>
//                                                                 < div * ngIf="orderDetails.length === 0" >
//                                                                     <h3>Thông tin sản phẩm: </h3>
//                                                                         < div * ngFor="let option of productDetails.productOptions" >
//                                                                             <span><strong>Màu sắc: </strong> {{ option.mauSac }}</span > <br>
//                                                                                 <span><strong>Dung lượng: </strong> {{ option.dungLuong }}</span > <br>
//                                                                                     <span><strong>Giá sản phẩm: </strong> {{ option.giaSp | currency }}</span > <br>
//                                                                                         <span><strong>Khuyến mãi: </strong> {{ option.khuyenMai | currency }}</span > <br>
//                                                                                             <span><strong>Số lượng: </strong> {{ option.soLuong }}</span > <br>
//                                                                                                 <img[src]="option.linkMauAnhSp" alt = "Product Option Image" width = "100" > <br><br>
//                                                                                                     </div>
//                                                                                                     </div>
//                                                                                                     < div class="toggle-container" >
//                                                                                                         <input type="radio" name = "choice" id = "confirm" />
//                                                                                                             <label class="option-label" for= "confirm"(click) = "deleteProduct()" > Yes </label>
//                                                                                                                 < input type = "radio" name = "choice" id = "cancel"(click) = "toggleDelProductCategoryForm()" checked />
//                                                                                                                     <label class="option-label" for= "cancel" > No </label>
//                                                                                                                         < span class= "toggleFilter" > </span>
//                                                                                                                         </div>
//                                                                                                                         </div>
//                                                                                                                         </div>
                                                                                                                            


// confirmDeleteProduct(productId: number) {
//     this.selectedProductIdToDelete = productId;
//     this.http.get(`http://localhost:8080/api/v1/product/${productId}`).subscribe((product: any) => {
//         this.productDetails = product;
//         this.isDeleteProductVisible = true;
//     });
// }