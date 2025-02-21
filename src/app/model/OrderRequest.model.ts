import { OrderDetail } from './order-detail.model';
import { Order } from './order.model';
import { Payment } from './Payment.model';
import { ThongTinKhachHang } from './thong-tin-khach-hang.model';

export class OrderRequest {
    order?: Order;
    orderDetails?: OrderDetail[];
    payment?: Payment;
    thongTinKhachHang?: ThongTinKhachHang;
}
