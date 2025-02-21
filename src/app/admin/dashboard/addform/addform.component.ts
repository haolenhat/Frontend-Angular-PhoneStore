import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-addform',
  templateUrl: './addform.component.html',
  styleUrls: ['./addform.component.css']
})
export class AddformComponent {
  @Input() isFormVisible: boolean = false; // Nhận giá trị từ DashboardComponent
  @Output() formClosed = new EventEmitter<void>(); // Emit sự kiện khi đóng form

  product = {
    ten_sp: '',
    thong_tin_sp: '',
    link_anh: '',
    trong_luong: 0,
    man_hinh: '',
    bo_nho: '',
    the_sim: '',
    he_dieu_hanh: '',
    cong_sac: '',
    camera: '',
    bao_mat: '',
    pin: '',
    bao_hanh: '',
    danh_muc: 'iphone',
    tuyChonSanPhams: [{
      mau_sac: '',
      dung_luong: '',
      gia_sp: 0,
      khuyen_mai: 0,
      so_sao_trung_binh: 0,
      so_luot_danh_gia: 0,
      so_luot_binh_luan: 0
    }]
  };

  // Hàm để đóng form
  closeForm() {
    this.formClosed.emit(); // Emit sự kiện khi đóng form
  }


  onSubmit() { }
  // // Phương thức gọi API để thêm sản phẩm
  // onSubmit(): void {
  //   this.productServic.addProduct(this.product).subscribe({
  //     next: (response) => {
  //       console.log('Sản phẩm đã được thêm thành công', response);
  //       // Xử lý khi thêm sản phẩm thành công (ví dụ: thông báo, reset form, v.v.)
  //     },
  //     error: (error) => {
  //       console.error('Có lỗi xảy ra khi thêm sản phẩm', error);
  //       // Xử lý lỗi khi thêm sản phẩm
  //     }
  //   });
  // }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.product.link_anh = file.name;
    }
  }
}
