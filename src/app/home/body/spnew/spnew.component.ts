import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../model/product.model';
import { ProductService } from '../../../../service/product.service';

@Component({
  selector: 'app-spnew',
  templateUrl: './spnew.component.html',
  styleUrls: ['./spnew.component.css']
})
export class SpnewComponent implements OnInit {
  latestProducts: Product[] = [];
  paginatedAllProducts: Product[] = [];
  currentAllPage: number = 1;
  totalAllPages: number = 1;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getLatestProducts().subscribe((products) => {
      this.latestProducts = products;
      this.paginatedAllProducts = products; // Gán latestProducts cho paginatedAllProducts
    });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/home/product', id]);
  }
}