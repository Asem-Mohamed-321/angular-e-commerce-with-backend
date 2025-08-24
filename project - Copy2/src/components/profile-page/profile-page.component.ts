import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Profile } from '../../app/models/profile.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile-page',
  imports: [RouterModule,RouterOutlet],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {

  cover:string = 'assets/banner.jpg';

  constructor(private profileService : ProfileService,private router: Router){}
  
  profile:Profile|null = null ; 
  userId : String ="";
  ngOnInit(){
    const token = localStorage.getItem("token");
        if (token) {
          const decoded: any = jwtDecode(token);
          this.userId = decoded.data._id;
        }
    this.loadProfile();

    //the next part is responsible of rerender the page in every reload
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadProfile();
    });
  }

  loadProfile(){
    this.profileService.getUser(this.userId!).subscribe({
      next: (data)=>{this.profile={...data};},
      error:(err)=>console.log(err)
    });
  }
}
