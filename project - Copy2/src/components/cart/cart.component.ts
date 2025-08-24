import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../app/models/cart-item.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  constructor(private cartService : CartService){}
  public cartItems: any[] =[]; 
  
  userId : String  = ""
  
  ngOnInit() {
  this.cartService.getAllItems().subscribe({
    next: (data) => {
      this.cartItems = data;
    },
    error: (err) => {
      console.log(err);
    }
  });
}


  getOriginalPrice(): number {
  let total = 0;

  for (let i = 0; i < this.cartItems.length; i++) {
    const item = this.cartItems[i];
    const price = parseFloat(item.product.price.replace('$', ''));
    total += price * item.quantity;
  }

  return total;
}
getstorePickUp(): number {
 if (!this.cartItems) return 0;
  
  for (let i = 0; i < this.cartItems.length; i++) {
    if (this.cartItems[i].quantity > 0) {
      return 20.00;
    }
  }
  return 0.00;
}

  getTotalPrice(): number {
      return this.getOriginalPrice()+this.getstorePickUp();
  }


  decreaseQuantity(item : CartItem){
    if (item.quantity > 0) {
      console.log(item)
      this.cartService.decreaseItem(item).subscribe({
        next: () => {
          item.quantity--
          this.cartService.updateCartCount()

        },
        error: (err: any) => console.error(err)
      });
    }
  }

  increaseQuantity(item : CartItem){
      this.cartService.increaseItem(item).subscribe({
        next: () => {
          item.quantity++
          this.cartService.updateCartCount()
        },
        error: (err: any) => console.error(err)
      });
  }

  removeItem(item : any){
    this.cartService.removeItem(item).subscribe({
    next: () => {
      console.log("Updated cartItems:", this.cartItems);

      this.cartItems = this.cartItems.filter((ci:any) => ci._id !== item._id);
      this.cartService.updateCartCount()

    },
    error: err => console.error("Failed to remove item:", err)
  });
  }
}
