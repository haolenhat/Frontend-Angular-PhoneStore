import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCartPage = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    // Scroll to the top on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    // Listen to route changes and check if the current route is 'cart'
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the URL includes the 'cart' route
        this.isCartPage = this.router.url.includes('cart');
      }
    });
  }
}
