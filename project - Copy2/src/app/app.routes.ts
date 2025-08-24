import { Routes } from '@angular/router';
import { AboutComponent } from '../components/about/about.component';
import { ErrorComponent } from '../components/error/error.component';
import { AppComponent } from './app.component';
import { HomeComponent } from '../components/home/home.component';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';
import { ProductsPageComponent } from '../components/products-page/products-page.component';
import { CartComponent } from '../components/cart/cart.component';
import { OneProductComponent } from '../components/one-product/one-product.component';
import { ProfilePageComponent } from '../components/profile-page/profile-page.component';
import { FavoriteComponent } from '../components/favorite/favorite.component';
import { EditProfileComponent } from '../components/edit-profile/edit-profile.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'register' ,canActivate: [() => !localStorage.getItem('token')] , component: RegisterComponent },
    { path: 'login', canActivate: [() => !localStorage.getItem('token')] ,component: LoginComponent },

    { path: 'products', component: ProductsPageComponent },
    { path: 'products/:id', component: OneProductComponent },
    { path: 'cart',canActivate: [() => !!localStorage.getItem('token')] , component: CartComponent },

    // { path: 'profile', component: ProfilePageComponent },
{
  path: 'profile',
  canActivate: [() => !!localStorage.getItem('token')] ,
  component: ProfilePageComponent,
  children: [
    { path: '', redirectTo: 'favorite', pathMatch: 'full' },
    { path: 'favorite', component: FavoriteComponent },
    { path: 'edit-profile', component: EditProfileComponent },
  ]
},




    { path: '**', component: ErrorComponent },
];
