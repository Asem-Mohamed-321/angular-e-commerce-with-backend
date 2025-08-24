import { Component  } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FavouritesService } from '../../services/favourites.service';
import { CommonModule } from '@angular/common';
import { FormGroup , FormControl, ReactiveFormsModule } from '@angular/forms';
import {getImageURL} from '../../js/imageApi.js'
import { Product } from '../../app/models/product.model';
import { Category } from '../../app/models/category.model';
import {jwtDecode} from 'jwt-decode'



@Component({
  selector: 'app-products-page',
  imports: [CommonModule,ReactiveFormsModule],
  providers: [ProductsService],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent {
products : Product[] | null = null
categories : any
userId : String | null = null
userRole : String = "user"


constructor( private productService : ProductsService ,private cartService : CartService,private favService : FavouritesService ,public router: Router){}

favouriteIds: any[] = [];

ngOnInit(){
  const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.data._id;
      this.userRole = decoded.data.role;
    }
  this.productService.getAllProducts().subscribe({
    next:(data:Product[])=>{this.products = data;console.log(this.products)},
    error: (err)=>{console.log(err)}
  })
  this.productService.getCategories().subscribe({
    next: (data:Category[])=>{this.categories = data},
    error: (err)=> console.log(err)
  })

  // Load user's favourites
    this.favService.getUserFavourites(this.userId!).subscribe({
      next: (favs: any[]) => {
        this.favouriteIds = favs.map(f => f.product);
      }
    });
  

    
}

// isFavourite(productId: string): boolean {
//   console.log(true)
//   return this.favouriteIds.some(fav => fav === productId);
// }

addProductToCart(item:Product){
  
  this.cartService.AddToCart(item).subscribe({
    next: (res) => {
      console.log("Item added to cart:", res);
      this.showToast("Item was added to the cart successfully");
      this.cartService.updateCartCount()
    }
    ,    error: (err) => console.error("Error adding to cart:", err)

  });
  // this.showToast("item was added to the cart successfully");
  // this.cartService.updateCartCount()
}

addToFav(item:Product){
  this.favService.AddToFav(item,this.userId!).subscribe({
    next: () => {
      if (this.favouriteIds.includes(item._id!)) {
        // Remove from favourites in UI
        this.favouriteIds = this.favouriteIds.filter(f => f !== item._id);
      } else {
        // Add to favourites in UI
        this.favouriteIds.push(item._id );
      }
    },
    error: (err) => console.error(err)
  });
}

openMenuId: String | null = null;
toggleMenu(id:String){
  console.log(id)
    this.openMenuId = this.openMenuId === id ? null : id;
}


selectedProductId: String | null = null;
selectedProductObject : Product|null = null
isModalOpen = false;

openModal(id: String ) {
  this.openMenuId=null
  this.selectedProductId = id;
  this.isModalOpen = true;
  // console.log("opened modal for id : ",id)
  const data = this.products?.find((p:Product)=>p._id === id) || null
  this.selectedProductObject = data;
  console.log(this.selectedProductObject)
  this.myForm.patchValue({
          desc: this.selectedProductObject!.desc,
          price: this.selectedProductObject!.price,
          cat: this.selectedProductObject!.cat,
          image: this.selectedProductObject!.image,
  });
  console.log(this.myForm.value)

}

closeModal() {
  this.selectedProductId = null;
  this.selectedProductObject=null;
  this.isModalOpen = false;
  this.openMenuId=null

}


editProduct(){
    if (!this.selectedProductObject || this.selectedProductId === null) {
      console.error("Missing selected product data.");
      return;
    }

    const editedValues = this.myForm.value
    const editedProduct = {...this.selectedProductObject,...editedValues,id: this.selectedProductObject._id}
    const priceRegex = /^\$\d+(\.\d{2})?$/;

    if (!priceRegex.test(editedValues.price)) {
      alert("Price must be in the format: $100.99");
      return;
    }
    console.log(editedProduct);
    if(this.selectedProductId){
    this.productService.editProduct(this.selectedProductId,editedProduct).subscribe({
      next: ()=>{
        
        const index = this.products?.findIndex((p:Product) => p._id === editedProduct.id);

        if (index !== -1 && index != undefined && this.products) {
          this.products[index] = { ...editedProduct };
        }
        console.log("successfully edited",this.selectedProductId);
        this.closeModal();
      },
      error: (err)=>{console.log(err)}
    });
    console.log("successfully edited",this.selectedProductId);
}}


  isLoading = true;

myForm = new FormGroup({
    desc :new FormControl(),
    price : new FormControl(),
    cat : new FormControl(),
    image : new FormControl(),
  })

  isImageUploading = false;

  async handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.isImageUploading = true;
      const imageUrl = await getImageURL(input, true);
      this.isImageUploading = false;
      if(this.isModalOpen && imageUrl){
        this.myForm.patchValue({ image: imageUrl });
      }
      else if(this.isNewProductModalOpen && imageUrl){
        this.newProductForm.patchValue({ nP_image: imageUrl });
      }
      
    }
  }

// confirm delete modal : 
showDeleteModal = false;

openDeleteModal(id: String) {
  this.selectedProductId = id;
  this.showDeleteModal = true;
}

confirmDelete() {
  if (this.selectedProductId !== null) {
    console.log('Deleting product with ID:', this.selectedProductId);
    
    this.productService.deleteProduct(this.selectedProductId).subscribe();
    if (this.products) this.products = this.products?.filter((p: Product) => p._id !== this.selectedProductId);
    this.showDeleteModal = false;
    this.selectedProductId = null;
  }
}

//new product modal :
isNewProductModalOpen=false

newProductForm = new FormGroup({
    nP_desc :new FormControl(),
    nP_price : new FormControl(),
    nP_cat : new FormControl(),
    nP_image : new FormControl(),
  })

openNewProductModal() {
  this.isNewProductModalOpen = true;
  console.log(this.myForm.value)
}

closeNewProductModal() {
  this.isNewProductModalOpen = false;
}

addNewProduct(){
  console.log("product added")

  
  const { nP_desc, nP_cat, nP_price, nP_image } = this.newProductForm.value;
  if (!nP_desc || !nP_cat || !nP_price || !nP_image) {
    alert("All fields are required.");
    return;
  }

  const newProductValues = {
    desc: nP_desc,
    cat: nP_cat,
    price: nP_price,
    image: nP_image
  };

 
  // const maxId = this.products && this.products.length > 0 ? this.products.reduce((max:number, p:Product) => Math.max(max, p._id), 0): 0; //getting the highest id and adding one to it which turned out to be the safest solution
  // const newId = maxId + 1;
  const newProduct = {
      // id : newId,
      reviews: 0,
      starts: 0,
      fav: false,
      ...newProductValues
    }

    const priceRegex = /^\$\d+(\.\d{2})?$/;

    if (!priceRegex.test(newProduct.price)) {
      alert("Price must be in the format: $100.99");
      return;
    }

    this.productService.addProduct(newProduct).subscribe({
      next: (data:Product)=>{this.products?.push(data),this.closeNewProductModal()},
      error: (err)=>{console.log(err)}
    })
    // console.log(newProduct);
}

toastList: { id: number; message: string; visible: boolean }[] = [];
toastId = 0;

showToast(message:string) {
  const id = this.toastId++;
  const toast = { id, message: message, visible: true };
  this.toastList.push(toast);
  setTimeout(() => {
    toast.visible = false;
    setTimeout(() => this.closeToast(id), 500); // Wait for fade-out
  }, 3000);
}

closeToast(id: number) {
  this.toastList = this.toastList.filter(t => t.id !== id);
}
dismissToast(toast: any) {
  toast.visible = false;
  setTimeout(() => this.closeToast(toast.id), 500);
}


filterMenu = false
openFilterMenu(){
  this.filterMenu=!this.filterMenu
}


selectedCategories: string[] = [];

toggleCategory(category: string) {
  const index = this.selectedCategories.indexOf(category);
  if (index > -1) {
    this.selectedCategories.splice(index, 1);
  } else {
    this.selectedCategories.push(category);
  }
  this.currentPage = 1;
  // console.log('Selected categories:', this.selectedCategories);
}

currentPage: number = 1;
itemsPerPage: number = 12;

get filteredProducts() {
  let filtered = this.selectedCategories.length === 0
    ? this.products
    : this.products?.filter((p: any) =>
        this.selectedCategories.includes(p.cat)
      );

  // Pagination logic
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return filtered?.slice(start, end);
}

get totalPages(): number[] {
  const filtered = this.selectedCategories.length === 0
    ? this.products??[]
    : (this.products??[]).filter((p: any) =>
        this.selectedCategories.includes(p.cat)
      );
  return Array(Math.ceil(filtered.length / this.itemsPerPage))
    .fill(0)
    .map((_, i) => i + 1);
}

goToPage(page: number) {
  this.currentPage = page;
}

prevPage() {
  if (this.currentPage > 1) this.currentPage--;
}

nextPage() {
  if (this.currentPage < this.totalPages.length) this.currentPage++;
}
  
}
