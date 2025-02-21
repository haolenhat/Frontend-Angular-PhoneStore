-- Tạo cơ sở dữ liệu nếu chưa có
CREATE DATABASE IF NOT EXISTS phonestore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE phonestore;

-- Bảng voucher
CREATE TABLE tbl_voucher (
    id_voucher INT PRIMARY KEY AUTO_INCREMENT,
    ma_voucher VARCHAR(50) UNIQUE NOT NULL,
    mo_ta TEXT,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    dieu_kien_su_dung DECIMAL(10, 2) DEFAULT 0,
    so_luong INT DEFAULT 0,
    loai_voucher ENUM('PERCENT', 'AMOUNT') NOT NULL,
    gia_tri DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB;

-- Bảng khách hàng
CREATE TABLE tbl_nguoidung (
    id_kh INT PRIMARY KEY AUTO_INCREMENT,
    mat_khau VARCHAR(255) UNIQUE NULL,
    ten_kh VARCHAR(250),
    vai_tro ENUM('USER', 'ADMIN') DEFAULT 'USER',
    mail VARCHAR(50) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
reset_token VARCHAR(255)
) ENGINE=InnoDB;

-- Bảng tình trạng đơn hàng
CREATE TABLE tbl_tinh_trang (
    id_tinh_trang INT PRIMARY KEY AUTO_INCREMENT,
    tinh_trang VARCHAR(50)
) ENGINE=InnoDB;

-- Bảng danh mục sản phẩm
CREATE TABLE tbl_dm_sanpham (
    id_dm INT PRIMARY KEY AUTO_INCREMENT,
    ten_dm VARCHAR(100)
) ENGINE=InnoDB;

-- Bảng sản phẩm chính
CREATE TABLE tbl_sanpham (
    id_sp INT PRIMARY KEY AUTO_INCREMENT,
    id_dm INT,
    ten_sp VARCHAR(100),
    thong_tin_sp VARCHAR(250),
    link_anh VARCHAR(250),
    trong_luong DECIMAL(10, 2),
    man_hinh VARCHAR(50),
    bo_nho VARCHAR(255),
    the_sim VARCHAR(50),
    he_dieu_hanh VARCHAR(50),
    cong_sac VARCHAR(50),
    camera VARCHAR(100),
    bao_mat VARCHAR(50),
    pin VARCHAR(100),
    bao_hanh VARCHAR(100),
    so_sao_trung_binh DECIMAL(3, 2) DEFAULT 0,
    so_luot_danh_gia INT DEFAULT 0,
    so_luot_binh_luan INT DEFAULT 0,
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dm) REFERENCES tbl_dm_sanpham(id_dm) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng tùy chọn sản phẩm
CREATE TABLE tbl_tuy_chon_sanpham (
    id_tuy_chon INT PRIMARY KEY AUTO_INCREMENT,
    id_sp INT,
    mau_sac VARCHAR(50),
link_mau_anh_sp VARCHAR(250),
    dung_luong VARCHAR(50),
    gia_sp DECIMAL(10, 2),
    khuyen_mai DECIMAL(10, 2) DEFAULT 0,
    so_luong INT DEFAULT 0,
    FOREIGN KEY (id_sp) REFERENCES tbl_sanpham(id_sp) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng thông tin khách hàng
CREATE TABLE tbl_thong_tin_kh (
    id_thong_tin INT PRIMARY KEY AUTO_INCREMENT,
    id_kh INT,
    ten_nguoi_nhan VARCHAR(50),
    dia_chi VARCHAR(255) NULL,
    tinh_thanh VARCHAR(100) NULL,
    quan_huyen VARCHAR(100) NULL,
    phuong_xa VARCHAR(100) NULL,
    sdt_kh VARCHAR(20) NULL,
    ghi_chu VARCHAR(255) NULL,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kh) REFERENCES tbl_nguoidung(id_kh) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng đơn đặt hàng
CREATE TABLE tbl_don_dh (
    id_ddh INT PRIMARY KEY AUTO_INCREMENT,
    id_kh INT,
    id_tinh_trang INT,
    ngay_lap DATE,
    ma_don_hang VARCHAR(50) UNIQUE NOT NULL,
    phi_ship DECIMAL(10, 2) DEFAULT 0,
    tong_gia DECIMAL(10, 2),
    id_voucher INT DEFAULT NULL,
    ten_nguoi_nhan VARCHAR(50),
    dia_chi VARCHAR(255),
    tinh_thanh VARCHAR(100),
    quan_huyen VARCHAR(100),
    phuong_xa VARCHAR(100),
    sdt_kh VARCHAR(20),
    FOREIGN KEY (id_kh) REFERENCES tbl_nguoidung(id_kh),
    FOREIGN KEY (id_tinh_trang) REFERENCES tbl_tinh_trang(id_tinh_trang),
    FOREIGN KEY (id_voucher) REFERENCES tbl_voucher(id_voucher) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Bảng chi tiết đơn đặt hàng
CREATE TABLE tbl_ct_ddh (
    id_ct_ddh INT PRIMARY KEY AUTO_INCREMENT,
    id_ddh INT,
    id_tuy_chon INT,
    so_luong_mua INT,
    don_gia DECIMAL(10, 2),
    FOREIGN KEY (id_ddh) REFERENCES tbl_don_dh(id_ddh) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_tuy_chon) REFERENCES tbl_tuy_chon_sanpham(id_tuy_chon) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng giỏ hàng
CREATE TABLE tbl_gio_hang (
    id_gio_hang INT PRIMARY KEY AUTO_INCREMENT,
    id_kh INT,
    id_tuy_chon INT,
    so_luong INT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kh) REFERENCES tbl_nguoidung(id_kh) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_tuy_chon) REFERENCES tbl_tuy_chon_sanpham(id_tuy_chon) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng thanh toán
CREATE TABLE tbl_thanh_toan (
    id_thanh_toan INT PRIMARY KEY AUTO_INCREMENT,
    id_ddh INT,
    phuong_thuc ENUM('payos', 'cod'),
    so_tien DECIMAL(10, 2),
    ngay_thanh_toan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ddh) REFERENCES tbl_don_dh(id_ddh) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng bình luận
CREATE TABLE tbl_binh_luan (
    id_binh_luan INT PRIMARY KEY AUTO_INCREMENT,
    id_kh INT,
    id_sp INT,
    noi_dung TEXT,
    danh_gia_sao INT CHECK(danh_gia_sao >= 1 AND danh_gia_sao <= 5),
    thoi_gian_binh_luan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kh) REFERENCES tbl_nguoidung(id_kh) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_sp) REFERENCES tbl_sanpham(id_sp) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- Thêm dữ liệu mẫu cho bảng tình trạng đơn hàng
-- INSERT INTO tbl_tinh_trang (tinh_trang) VALUES 
-- ('Pending'),
-- ('Processing'), 
-- ('Shipped'), 
-- ('Delivered'),
-- ('Cancel'),
-- ('Return');

-- SELECT 
--     dm.ten_dm AS danh_muc,
--     sp.ten_sp AS ten_san_pham,
--     sp.thong_tin_sp,
--     sp.link_anh AS anh_san_pham,
--     sp.trong_luong,
--     sp.man_hinh,
--     sp.bo_nho,
--     sp.the_sim,
--     sp.he_dieu_hanh,
--     sp.cong_sac,
--     sp.camera,
--     sp.bao_mat,
--     sp.pin,
--     sp.bao_hanh,
--     sp.so_sao_trung_binh,
--     sp.so_luot_danh_gia,
--     sp.so_luot_binh_luan,
--     tc.mau_sac,
--     tc.link_mau_anh_sp,
--     tc.dung_luong,
--     tc.gia_sp,
--     tc.khuyen_mai,
--     tc.so_luong
-- FROM tbl_dm_sanpham dm
-- JOIN tbl_sanpham sp ON dm.id_dm = sp.id_dm
-- JOIN tbl_tuy_chon_sanpham tc ON sp.id_sp = tc.id_sp;

