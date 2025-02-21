export interface OrderItem {
    tenSanPham: string;
    soLuong: number;
    donGia: number;
    mauSac: string;
    dungLuong: string;
    linkMauAnhSP: string;
}

export interface Order {
    idDdh: number;
    idKh: number;
    maDonHang: string;
    tenKhachHang: string;
    tongGia: number;
    phiShip: number;
    ngayLap: string;
    idVoucher: number | null;
    tenNguoiNhan: string;
    diaChi: string;
    tinhThanh: string;
    quanHuyen: string;
    phuongXa: string;
    sdtKh: string;
    items: OrderItem[];
    payment: {
        phuongThuc: string;
        soTien: number;
    };
    tinhTrang: {
        idTinhTrang: number;
        tinhTrang: string;
    };
    showLocation?: boolean;
    isEditing?: boolean;
    showEmailForm?: boolean;
}
