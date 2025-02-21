export interface Product {
    idSp: number;
    tenSp: string;
    thongTinSp: string;
    linkAnh: string;
    trongLuong: number;
    manHinh: string;
    boNho: string;
    theSim: string;
    heDieuHanh: string;
    congSac: string;
    camera: string;
    baoMat: string;
    pin: string;
    soSaoTrungBinh: number;
    soLuotDanhGia: number;
    soLuotBinhLuan: number;
    baoHanh: string;
    ngayTao: string;
    productOptions: ProductOption[];
    productCategory: ProductCategory; // Chỉnh sửa tại đây
}

export interface ProductOption {
    idTuyChon: number;
    product?: Product; // Liên kết tới Product
    mauSac: string;
    linkMauAnhSp: string;
    dungLuong: string;
    giaSp: number;
    khuyenMai: number;
    soLuong: number;
    giaSauKhuyenMai: number;
}

export interface ProductCategory {
    idDm: number;
    tenDm: string;
    products?: Product[]; // Chỉnh sửa tại đây để chứa danh sách sản phẩm
}


export interface Comment {
    idBinhLuan?: number;
    user?: {
        idKh: number;
        tenKh?: string;
        mail?: string;
    };
    product?: {
        idSp: number;
    };
    noiDung: string;
    danhGiaSao: number;
    thoiGianBinhLuan?: string; // Bạn có thể chuyển đổi thành định dạng ngày giờ nếu cần
}
