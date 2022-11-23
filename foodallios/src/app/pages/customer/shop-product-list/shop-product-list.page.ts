import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { TableOrder } from 'src/app/interfaces/tableOrder.interface';
import { Product } from 'src/app/interfaces/product.interface';
import { Shop } from 'src/app/interfaces/shop.interface';
import { SharedFuns } from 'src/app/shared/shared';
import { ShopProductListService } from './shop-product-list.service';

@Component({
  selector: 'app-shop-product-list',
  templateUrl: './shop-product-list.page.html',
  styleUrls: ['./shop-product-list.page.scss'],
})
export class ShopProductListPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal
  shopTitle: string;

  //Table to be field for the get request with all the products.
  //Table with shop details to preview
  productList: Product[];

  //addToCart details
  productToCart: TableOrder;

  //To be used by the modal, see the details and place the order.
  productDetails: Product = { id: '', shopId: '', title: '', category: '', quantity: null, price: null, description: '' };

  //Fetched data from homepage
  shopId: string;
  wrkHour: string;
  availableProducts: string;
  address: string;
  shopName: string;

  //[isOpen] for the modal.
  $isOpen: boolean = false;

  //counter for modal
  count: number = 1;

  constructor(
    private service: ShopProductListService,
    private route: ActivatedRoute,
    private sharedFuns: SharedFuns,
    ) { }

  ngOnInit() {
    //fetching shop data from homepage
    this.route.paramMap.subscribe(data => { this.shopId = data.get('id'); })
    // this.route.paramMap.subscribe(data => this.wrkHour = data.get('wrkHour'))
    // this.route.paramMap.subscribe(data => this.availableProducts = data.get('availableProducts'))
    // this.route.paramMap.subscribe(data => this.address = data.get('address'))

    this.service.getShopProductList(this.shopId).subscribe(
      productList => { this.productList = productList; console.log(productList) },
      err => { throw new Error(err) },
      () => { }
    )

    console.log(sessionStorage.getItem('productCart'))
  }

  getProductDetails(shopId: string, productId: string) {
    this.$isOpen = true;
    return this.service.getShopProductDetails(shopId, productId).subscribe(
      productDetails => { this.productDetails = productDetails; },
      err => { throw new Error(err) }
    )
  }

  addToCart(title, productId, itemPrice) {
    this.productToCart = 
    {
      title: title,
      productId: productId,
      customerId: sessionStorage.getItem('customerId'),
      quantity: this.count,
      orderPrice: itemPrice*this.count,
      purchaseId: sessionStorage.getItem('purchaseId'),
      createdAt: new Date()
    }
    this.sharedFuns.updateSessionStorage('productCart', this.productToCart)
    console.log(sessionStorage.getItem('productCart'))
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // confirm() {
  //   this.modal.dismiss(this.name, 'confirm');
  // }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    this.$isOpen = false;

  }

  increment(maxCount: number) {
    if (this.count != maxCount ){
      this.count++;
    }
  }

  decrement() {
    if(this.count != 1){
      this.count--;
    }
  }
}
