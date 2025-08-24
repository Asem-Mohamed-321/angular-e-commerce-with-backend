import { Component } from '@angular/core';
import { RouterLink, RouterOutlet ,RouterModule  } from '@angular/router';
import { AboutComponent } from '../components/about/about.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    RouterModule,
    
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
}
