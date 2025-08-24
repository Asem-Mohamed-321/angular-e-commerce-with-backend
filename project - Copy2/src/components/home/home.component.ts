import { CommonModule } from '@angular/common';
import { Component , } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SlidingPromotionsComponent } from '../sliding-promotions/sliding-promotions.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink,SlidingPromotionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router : Router){}
  route(){
    if(localStorage.getItem("token")){
      this.router.navigate(['/products']);
    }else{
      this.router.navigate(['/login']);
    }
  }
}
