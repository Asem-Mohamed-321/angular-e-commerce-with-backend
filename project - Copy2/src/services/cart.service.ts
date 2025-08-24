import { HttpClient } from '@angular/common/http';
import { Injectable , Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  @Output() cartCountChanged = new EventEmitter<number>();
  private URL="http://localhost:3000/cartItems"

  constructor(private http : HttpClient) { 
    this.updateCartCount();
  }

   updateCartCount() {
    this.getAllItems().subscribe((items: any[]) => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountChanged.emit(total);
  });
  }

  getAllItems(): Observable<any[]> {
  const token = localStorage.getItem("token");
  
  return this.http.get<any[]>(`http://localhost:3001/cart`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


  // AddToCart(item:any, userId : String){
    // this.http.get(this.URL).subscribe({
    //   next: (userCart:any)=>{
    //     const existingItem = userCart.find((ci :any) => ci.id === item.id);

    //     if (existingItem) {
    //     const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
    //     this.http.put(this.URL+"/"+existingItem.id, updatedItem).subscribe({
    //       next: () => {
    //         console.log('Item updated')
    //         this.updateCartCount();
    //       },
    //       error: (err) => console.error('Failed to update item', err)
    //     });
    //   } else {
    //     const newItem = { ...item, quantity: 1 };
    //     this.http.post(this.URL, newItem).subscribe({
    //       next: () =>{ 
    //         console.log('Item added')
    //         this.updateCartCount();
    //       },
    //       error: (err) => console.error(err)
    //     });
    //   }
    // },
    // error: (err) => console.error( err)

    // })
    // this.http.post(this.URL,item)
  //   console.log(item._id)
  //   console.log(userId)
  //   return this.http.post("http://localhost:3001/cart/",{
  //     userId: userId,
  //     productId: item._id,
  //   })
  // }
  AddToCart(item: any) {
  const token = localStorage.getItem("token");
  return this.http.post("http://localhost:3001/cart/", {
    productId: item._id
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

  decreaseItem(item : any){
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    return this.http.put(`http://localhost:3001/cart/${item._id}`, updatedItem);
  }

  increaseItem(item : any){
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    
    return this.http.put(`http://localhost:3001/cart/${item._id}`, updatedItem);
  }

  removeItem(item : any){
    console.log(item._id)
    return this.http.delete(`http://localhost:3001/cart/${item._id}`);
  }
}
