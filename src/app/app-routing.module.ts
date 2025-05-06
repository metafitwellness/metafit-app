import { CitiesComponent } from './pages/cities/cities.component';
import { AllSubscriptionsComponent } from './pages/all-subscriptions/all-subscriptions.component';
import { HotelsViewComponent } from './pages/hotels-view/hotels-view.component';
import { HotelsListComponent } from './pages/hotels-list/hotels-list.component';
import { AddRoomComponent } from './pages/add-room/add-room.component';
import { MySubscriptionsComponent } from './pages/my-subscriptions/my-subscriptions.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { KycListComponent } from './pages/kyc-page/kyc-list/kyc-list.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { CustomerInformationComponent } from './pages/customer-information/customer-information.component';
import { CustomerInformationListComponent } from './pages/customer-information-list/customer-information-list.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { UserUpdateComponent } from './pages/setting/user-update/user-update.component';
import { SettingComponent } from './pages/setting/setting.component';
import { LoginComponent } from './pages/login/login.component';
import { ViewInvoiceComponent } from './pages/invoice-credit-system/view-invoice/view-invoice.component';
import { InvoiceCreditSystemComponent } from './pages/invoice-credit-system/invoice-credit-system.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KycPageComponent } from './pages/kyc-page/kyc-page.component';
import { NotFoundComponent } from './pages/error-page/not-found/not-found.component';
import { LoginGuard } from './guards/login.guard';
import { UserGuard } from './guards/user.guard';
import { AdminGuard } from './guards/admin.guard';
import { HotelsOtpPendingComponent } from './pages/hotels-otp-pending/hotels-otp-pending.component';
import { SegmentsComponent } from './pages/segments/segments.component';
import { PurchasePlanComponent } from './pages/purchase-plan/purchase-plan.component';
import { OnboardingAmountComponent } from './pages/onboarding-amount/onboarding-amount.component';
import { FooterlinkComponent } from './pages/footerlink/footerlink.component';
import { FooterlinkManageComponent } from './pages/footerlink-manage/footerlink-manage.component';
import { AddBlogsComponent } from './pages/add-blogs/add-blogs.component';
import { BlogsComponent } from './pages/blogs/blogs.component';


const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [LoginGuard] },
  { path: 'login', component: UserLoginComponent },
  { path: 'first-login/:id', component: UserLoginComponent },
  { path: 'admin-login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'manage-rooms', component: RoomsComponent, canActivate: [UserGuard] },
  { path: 'manage-subscriptions', component: MySubscriptionsComponent, canActivate: [UserGuard] },
  { path: 'settings', component: UserUpdateComponent, canActivate: [UserGuard] },
  { path: 'add-room', component: AddRoomComponent, canActivate: [UserGuard] },
  { path: 'add-room/:id', component: AddRoomComponent, canActivate: [UserGuard] },
  { path: 'subscribe', component: SubscribeComponent, canActivate: [UserGuard] },
  { path: 'purchase-plan', component: PurchasePlanComponent, canActivate: [UserGuard] },

  { path: 'vendors', component: HotelsListComponent, canActivate: [AdminGuard] },
  { path: 'hotels-otp-pending', component: HotelsOtpPendingComponent, canActivate: [AdminGuard] },
  { path: 'hotels/:ids', component: HotelsViewComponent, canActivate: [AdminGuard] },
  { path: 'all-subscriptions', component: AllSubscriptionsComponent, canActivate: [AdminGuard] },
  { path: 'cities', component: CitiesComponent, canActivate: [AdminGuard] },
  { path: 'segments', component: SegmentsComponent, canActivate: [AdminGuard] },
  { path: 'onboarding-amount', component: OnboardingAmountComponent, canActivate: [AdminGuard] },
  { path: 'footer-link-add', component: FooterlinkComponent, canActivate: [AdminGuard] },
  { path: 'footer-link-add/:id', component: FooterlinkComponent, canActivate: [AdminGuard] },
  { path: 'add-blog', component: AddBlogsComponent, canActivate: [AdminGuard] },
  { path: 'add-blog/:id', component: AddBlogsComponent, canActivate: [AdminGuard] },
  { path: 'blogs', component: BlogsComponent, canActivate: [AdminGuard] },
  { path: 'footer-link', component: FooterlinkManageComponent, canActivate: [AdminGuard] },

  //404
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
