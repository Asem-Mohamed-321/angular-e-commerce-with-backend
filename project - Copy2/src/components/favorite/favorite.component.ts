import { Component } from '@angular/core';
import { FavouritesService } from '../../services/favourites.service';
import { Product } from '../../app/models/product.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-favorite',
  imports: [],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent {
  constructor(private favService : FavouritesService){}
  public favouriteItems: any[] | null = [];
  public isLoading = true;
  userId : string = "" ;

  ngOnInit(){
    const token = localStorage.getItem("token");
        if (token) {
          const decoded: any = jwtDecode(token);
          this.userId = decoded.data._id;
        }
    this.favService.getDetailedUserFavourites(this.userId).subscribe({
      next: (data :any[] | null)=>{
        this.favouriteItems=data;
        this.isLoading = false;
        console.log(data)
},
      error: (err)=>{console.log(err);this.isLoading = true;
}
    })
  }
  removeItem(item:Product){
    console.log(item)
    this.favService.removeFromFav(item,this.userId);
    if(this.favouriteItems){
      this.favouriteItems = this.favouriteItems.filter((f:Product) => f._id !== item._id)
    }
    console.log(this.favouriteItems)
  }
}
