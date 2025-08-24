import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router : Router){}

  name: string = "";
  password: string = "";
  email: string = "";

  handleSubmit(){
    console.log(this.name);
    console.log(this.password);
    console.log(this.email);
    axios.post("http://localhost:3001/user/register", {
      username : this.name,
      password : this.password,
      email : this.email,
    }
    ).then((response) => {
      console.log(response.data);
      this.router.navigate(['login'])

    }).catch((error) => {
      console.error("Error occurred during registration:", error);
      alert("Registration failed: " + error.message);
    });
  }
}
