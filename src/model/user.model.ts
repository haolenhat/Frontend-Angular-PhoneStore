// user.model.ts

export enum VaiTro {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export class User {
    id: number;
    taiKhoan: string;
    matKhau: string;
    tenKhachHang: string;
    vaiTro: VaiTro;
    mail: string;
    googleId: string;
    ngayTao: Date; // LocalDateTime in Java corresponds to Date in TypeScript

    constructor(
        id: number,
        taiKhoan: string,
        matKhau: string,
        tenKhachHang: string,
        vaiTro: VaiTro,
        mail: string,
        googleId: string,
        ngayTao: Date
    ) {
        this.id = id;
        this.taiKhoan = taiKhoan;
        this.matKhau = matKhau;
        this.tenKhachHang = tenKhachHang;
        this.vaiTro = vaiTro;
        this.mail = mail;
        this.googleId = googleId;
        this.ngayTao = ngayTao;
    }
}
