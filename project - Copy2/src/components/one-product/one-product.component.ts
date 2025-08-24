import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-one-product',
  imports: [],
  providers:[ProductsService],
  templateUrl: './one-product.component.html',
  styleUrl: './one-product.component.css'
})
export class OneProductComponent {
  private productId ;
  
  constructor(activatedRoute : ActivatedRoute , private productService : ProductsService){
    this.productId=activatedRoute.snapshot.params['id']
  }
  ngOnInit(){
    this.productService.getOneProducts(this.productId).subscribe({
      next: (data)=>{console.log(data)},
      error: (err)=>{console.log(err)}
    })
  }
}
