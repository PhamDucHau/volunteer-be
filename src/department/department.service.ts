import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class DepartmentService {
    constructor() { }
    async getAllStats() {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        return [
            {
                bg: "primary-gradient",
                icon: "hugeicons:money-bag-02",
                color: "bg-primary",
                title: "DOANH THU",
                price: "$336,867,800",
                link: "#",
            },
            {
                bg: "warning-gradient",
                icon: "ri:shirt-fill",
                color: "bg-warning",
                title: "SỐ LƯỢNG SẢN PHẨM",
                price: "965,000",
                link: "#",
            },
            {
                bg: "secondary-gradient",
                icon: "material-symbols:face-6",
                color: "bg-secondary",
                title: "NHÂN VIÊN",
                price: "35,700",
                link: "#",
            },
            {
                bg: "error-gradient",
                icon: "streamline-plump:stock-remix",
                color: "bg-error",
                title: "CỔ PHIẾU USD",
                price: "$607,826,700",
                link: "#",
            },
            {
                bg: "success-gradient",
                icon: "material-symbols:warehouse-outline-rounded",
                color: "bg-success",
                title: "TỒN KHO THÀNH PHẨM",
                price: "$147,687,900",
                link: "#",
            },
        ]
    }
}
