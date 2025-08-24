import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../app/models/profile.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    private profileSubject = new BehaviorSubject<Profile | null>(null);
    profile$ = this.profileSubject.asObservable();


  constructor(private http : HttpClient) { }
  
  getUser(id : String):Observable<Profile>{
    // return this.http.get<Profile>("http://localhost:3000/profiles/"+id)
    return this.http.get<any>("http://localhost:3001/user/"+id)

  }

  editProfile(id : String,updatedUser : any){
    // return this.http.put("http://localhost:3000/profiles/"+id,updatedUser)
    console.log(id);
    console.log(updatedUser)
    return this.http.put("http://localhost:3001/user/"+id,updatedUser)
  }
  // editProfile(userId: String, data: any) {
  //   return this.http.put<Profile>(`http://localhost:3001/user/${userId}`, data)
      
  // }
  setProfile(profile: Profile|null) {
    this.profileSubject.next(profile);
  }
}
