export interface Order {
    idDdh?: number;
    idKh: number;
    idTinhTrang: number;
    ngayLap: string;
    maDonHang: string;
    tongGia: number;
    idVoucher?: number | null;
    tenNguoiNhan: string;
    diaChi: string;
    tinhThanh: string;
    quanHuyen: string;
    phuongXa: string;
    sdtKh: string;
    phiShip: number;
    showLocation?: boolean;
}

