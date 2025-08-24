import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
constructor(private profileService: ProfileService , private cartService : CartService, private router: Router) {}
  email:String="";
  password:String="";

  async handleLogin(){
    console.log(this.email,this.password);
    try{
      const res = await axios.post("http://localhost:3001/user/login",{
      email:this.email,
      password:this.password,
    })
    localStorage.setItem("token",res.data)
    console.log(res)
    alert("logged in successfully")

    // Decode user ID from token
      const decoded: any = jwtDecode(res.data);
      const userId = decoded.data._id;

      // Fetch user data and set it in the shared service
      const userRes = await axios.get(`http://localhost:3001/user/${userId}`);
      this.profileService.setProfile(userRes.data);

      this.cartService.updateCartCount();
      this.router.navigate(['/products']);
    }catch(err:any){
      if (err.response) {
      // Handle client errors (400–499)
      if (err.response.status >= 400 && err.response.status < 500) {
        alert(err.response.data);
        console.log("Client error:", err.response);
      } else {
        alert("Something went wrong. Please try again.");
        console.error("Server error:", err.response);
      }
    } else {
      // Network or unknown error
      alert("Network error. Please check your connection.");
      console.error("Unknown error:", err);
    }
    }
  }
  handleLogOut(){
    console.log("logout")
    localStorage.removeItem("token")
    alert("logged out")
  }
}
