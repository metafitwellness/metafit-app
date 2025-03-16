import { SafePipe } from './pipes/safe.pipe';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './modules/materials/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InvoiceCreditSystemComponent } from './pages/invoice-credit-system/invoice-credit-system.component';
import { ViewInvoiceComponent } from './pages/invoice-credit-system/view-invoice/view-invoice.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { UploadModalComponent } from './components/upload-modal/upload-modal.component';
import { EsignModalComponent } from './components/esign-modal/esign-modal.component';
import { CreateUserModalComponent } from './components/create-user-modal/create-user-modal.component';
import { LoginComponent } from './pages/login/login.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { SettingComponent } from './pages/setting/setting.component';
import { UserUpdateComponent } from './pages/setting/user-update/user-update.component';
import { UserDeleteModalComponent } from './components/user-delete-modal/user-delete-modal.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderRegisterComponent } from './components/header-register/header-register.component';
import { WizardStepsComponent } from './components/wizard-steps/wizard-steps.component';
import { SuccessComponent } from './components/registration/success/success.component';
import { ErrorComponent } from './components/registration/error/error.component';
import { CustomerInformationComponent } from './pages/customer-information/customer-information.component';
import { RegistrationDetailsComponent } from './pages/customer-information/registration-details/registration-details.component';
import { KycDetailsComponent } from './pages/customer-information/kyc-details/kyc-details.component';
import { CustomerInformationListComponent } from './pages/customer-information-list/customer-information-list.component';
import { KycPageComponent } from './pages/kyc-page/kyc-page.component';
import { KycListComponent } from './pages/kyc-page/kyc-list/kyc-list.component';
import { KycBlockComponent } from './components/kyc-block/kyc-block.component';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { NotFoundComponent } from './pages/error-page/not-found/not-found.component';
import { CreditDetailsComponent } from './pages/customer-information/credit-details/credit-details.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { MySubscriptionsComponent } from './pages/my-subscriptions/my-subscriptions.component';
import { AddRoomComponent } from './pages/add-room/add-room.component';
import { HotelsListComponent } from './pages/hotels-list/hotels-list.component';
import { HotelsViewComponent } from './pages/hotels-view/hotels-view.component';
import { AllSubscriptionsComponent } from './pages/all-subscriptions/all-subscriptions.component';
import { CitiesComponent } from './pages/cities/cities.component';
import { HotelmodalComponent } from './components/hotelmodal/hotelmodal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { HotelsOtpPendingComponent } from './pages/hotels-otp-pending/hotels-otp-pending.component';
import { SegmentsComponent } from './pages/segments/segments.component';
import { MakePaymentComponent } from './pages/make-payment/make-payment.component';
import { PurchasePlanComponent } from './pages/purchase-plan/purchase-plan.component';
import { OnboardingAmountComponent } from './pages/onboarding-amount/onboarding-amount.component';
import { VendorEditModalComponent } from './components/vendor-edit-modal/vendor-edit-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    InvoiceCreditSystemComponent,
    ViewInvoiceComponent,
    ConfirmationModalComponent,
    UploadModalComponent,
    EsignModalComponent,
    CreateUserModalComponent,
    SafePipe,
    LoginComponent,
    SettingComponent,
    UserUpdateComponent,
    UserDeleteModalComponent,
    AboutusComponent,
    RegisterComponent,
    HeaderRegisterComponent,
    WizardStepsComponent,
    SuccessComponent,
    ErrorComponent,
    CustomerInformationComponent,
    RegistrationDetailsComponent,
    KycDetailsComponent,
    CustomerInformationListComponent,
    UserLoginComponent,
    KycPageComponent,
    KycListComponent,
    KycBlockComponent,
    InformationModalComponent,
    FileViewerComponent,
    NotFoundComponent,
    CreditDetailsComponent,
    SubscribeComponent,
    RoomsComponent,
    MySubscriptionsComponent,
    AddRoomComponent,
    HotelsListComponent,
    HotelsViewComponent,
    AllSubscriptionsComponent,
    CitiesComponent,
    HotelmodalComponent,
    LoaderComponent,
    HotelsOtpPendingComponent,
    SegmentsComponent,
    MakePaymentComponent,
    PurchasePlanComponent,
    OnboardingAmountComponent,
    VendorEditModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true  // Allows multiple interceptors
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
