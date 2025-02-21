import { Product } from "./product.model";

export interface CartItem {
    idGioHang?: number;
    user: UserDTO;
    productOption: ProductOptionDTO;
    soLuong: number;
    ngayTao?: string;
}

export interface UserDTO {
    idKh: number;
    tenKh: string;
    role: string;
    mail: string;
}

export interface ProductOptionDTO {
    idTuyChon: number;
    mauSac: string;
    dungLuong: string;
    giaSp: number;
    tenSp: string;
    linkAnh: string;
    soLuong: number;  // Thêm thuộc tính này vào
    product?: Product; // Liên kết tới Product để lấy idSp
}

export interface CartItemWithChecked extends CartItem {
    checked: boolean;
}
