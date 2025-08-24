import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../app/models/product.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private URL="http://localhost:3000/favourites"

  constructor(private http : HttpClient) { }

  getAllItems():Observable<Product[]> {
    return this.http.get<Product[]>("http://localhost:3001/favourites")
  }

   AddToFav(item:any,userId : String){
    //   this.http.get("http://localhost:3000/products").subscribe({
    //   next: (allFavItems:any)=>{
    //     const existingItem = allFavItems.find((ci :any) => ci.id === item.id);
    //     if (existingItem.fav === true) {
    //       const updatedItem = { ...existingItem, fav: false };
    //       this.http.put("http://localhost:3000/products/"+existingItem.id, updatedItem).subscribe({
    //         next: () => {
    //           item.fav= false;
    //           console.log('Item updated');
    //           this.http.delete("http://localhost:3000/favourites/"+existingItem.id).subscribe({
    //             next: () => console.log("Removed from favourites"),
    //             error: (err) => console.error(err)
    //           })
    //         },
    //         error: (err) => console.error('Failed to update item', err)
    //       });
    //     } else {
    //       console.log("false")
    //       const newItem = { ...item, fav:true };
    //       this.http.put("http://localhost:3000/products/"+existingItem.id, newItem).subscribe({
    //         next: () => {
    //           item.fav= true;
    //           console.log("flagged out");
    //           console.log(item)
    //           this.http.post("http://localhost:3000/favourites",newItem).subscribe({
    //             next: () => console.log("Added to /favourites"),
    //             error: err => console.error( err)
    //         })},
    //         error: (err) => console.error(err)
    //       });
    //     }
        
    //   },
    //   error: (err)=>{console.log(err)}
    // })
    return this.http.post('http://localhost:3001/favourites',{
      productId : item._id,
      userId : userId
    })
  }

  getUserFavourites(userId:String){
    return this.http.get<any[]>("http://localhost:3001/favourites/"+userId)
  }

  getDetailedUserFavourites(userId:String){
    return this.http.get<any[]>("http://localhost:3001/favourites/detailed/"+userId)
  }

  removeFromFav(item : any , userId : String){
  //   this.http.delete(this.URL+"/"+item.id).subscribe({
  //     next:()=>{
  //       const  updatedItem = { ...item, fav: false };
  //       this.http.put("http://localhost:3000/products/"+item.id, updatedItem).subscribe({
  //         next: () => { "updated in the products (fav flag)"  },
  //         error: (err)=>{console.log("couldn't update the products flag",err)}
  //       })
  //     },
  //     error:(err)=>(console.log(err))
  //     })
  // }
  return this.http.delete("http://localhost:3001/favourites/"+item.product._id,{
    body: {userId : userId}
  }).subscribe()
  }
}
