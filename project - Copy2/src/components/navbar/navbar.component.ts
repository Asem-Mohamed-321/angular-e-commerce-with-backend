import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Profile } from '../../app/models/profile.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  cartCount = 0;


  isMenuOpen = false;
  userId : String = "";

  toggleMenu() {
    console.log("toggle")
    this.isMenuOpen = !this.isMenuOpen;
  }


  constructor(private profileService : ProfileService , private cartService: CartService , private router : Router){}
  profileData : Profile |null = null

  ngOnInit() {
    this.profileService.profile$.subscribe(profile => {
      this.profileData = profile;
      console.log("Navbar received profile update:", this.profileData);
    });

    this.cartService.cartCountChanged.subscribe(count => {
      this.cartCount = count;
    });

    this.cartService.updateCartCount();

    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      const userId = decoded.data._id;
      this.profileService.getUser(userId).subscribe({
        next: (data: Profile) => this.profileService.setProfile(data), // <--- update via service
        error: err => console.log(err)
      });
    }
  }


  signOut(){
    localStorage.removeItem("token");
    this.userId="";
    this.isMenuOpen = false;
    this.profileService.setProfile(null);
    this.cartCount = 0; // update the local value
  this.cartService.cartCountChanged.emit(0); // notify other components
  }
  checkLoggedIn(url : String){
    if(this.profileData){
      this.router.navigate(['/login'])
    }else{
      this.router.navigate([url])
    }
  }
}
