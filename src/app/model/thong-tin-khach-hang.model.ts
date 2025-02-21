export interface ThongTinKhachHang {
    [key: string]: any;
    idThongTin: number;
    idKh: number;
    tenNguoiNhan: string;
    diaChi: string;
    tinhThanh: string;
    quanHuyen: string;
    phuongXa: string;
    sdtKh: string;
    ghiChu: string;
    ngayCapNhat: Date;
    selected?: boolean;
}
