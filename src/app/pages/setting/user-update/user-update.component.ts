import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from './../../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Component, OnInit, ChangeDetectorRef, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, AfterViewInit {
  reason: string = '';

  userId: number = 0;
  editForm: boolean = true;

  // New fields for profile data
  designation: string = '';
  degree: string = '';
  passoutYear: string = '';
  yearsOfExperience: string = '';
  selfPhoto: File | null = null;
  aadharPhoto: File | null = null;
  clinicPhoto: File | null = null;
  achievements: string = '';
  panCardPhotoFront: File | null = null;
  panCardPhotoBack: File | null = null;
  bankName: string = '';
  bankAc: string = '';
  bankIfsc: string = '';
  instagramUrl: string = '';
  linkedinUrl: string = '';
  youtubeUrl: string = '';
  facebookUrl: string = '';
  websiteUrl: string = '';
  alternativeContact: string = '';
  bank_ac: any = '';
  bank_ifsc: any = '';

  officeAddress: string = '';
  homeAddress: string = '';
  whatsappNo: string = '';
  emailId: string = '';
  pincode: any = '';
  address_line_1: any = '';
  address_line_2: any = '';
  googleMapUrl: any = '';

  imagePreviews: string[] = [];
  imageFiles: File[] = [];

  imageUploaded: any = [];
  emailError: any = '';

  userData: any = [];
  filePath: any = '';

  selfPhotoPreview: string | null = null;
  aadharPhotoPreview: string | null = null;
  clinicPhotoPreview: string | null = null;
  panCardPhotoPreview: string | null = null;

  passoutYears: number[] = [];
  yearsOfExperienceOptions: number[] = [];


  @ViewChild('googleLocationIn') googleLocationIn: ElementRef;
  googleLat: any = '';
  googleLong: any = '';
  googleLocation: any = '';


  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userData = this.userService.getData('userData');
    this.filePath = environment.uploadPath + 'images/'; // Adjust the path if necessary
    this.getUserData();
    this.initializePassoutYears();
    this.initializeExperienceOptions();
  }

  ngAfterViewInit(): void {
    if (this.googleLocationIn && this.googleLocationIn.nativeElement) {
      this.initAutocomplete();
    } else {
      console.error('Google Location input not found.');
    }
  }


  async getUserData() {
    await this.userService.userData(this.userData.id).subscribe((res: any) => {
      if (res.data) {
        let data = res.data;

        // Assign default values or empty strings to prevent 'null' from appearing in inputs
        this.officeAddress = data.officeAddress || '';
        this.homeAddress = data.homeAddress || '';
        this.whatsappNo = data.whatsappNo || '';
        this.emailId = data.emailId || '';
        this.pincode = data.pincode || '';
        this.googleMapUrl = data.google_map_url || '';
        this.imageUploaded = data.images || [];

        // Setting new data fields from response
        this.designation = data.Designation || '';
        this.degree = data.Degree || '';
        this.passoutYear = data.passoutYear || '';
        this.yearsOfExperience = data.yearsOfExperience || ''; // Default empty string for yearsOfExperience if null
        this.achievements = data.achievements || '';
        this.bankName = data.bank_name || '';
        this.bankAc = data.bank_ac || '';
        this.bankIfsc = data.bank_ifsc || '';
        this.instagramUrl = data.instagram_url || '';
        this.linkedinUrl = data.linkedin_url || '';
        this.youtubeUrl = data.youtube_url || '';
        this.facebookUrl = data.facebook_url || '';
        this.websiteUrl = data.website_url || '';
        this.alternativeContact = data.alternative_contact || '';
        this.bank_ifsc = data.bank_ifsc || ''; // Ensuring no null for IFSC code
        this.bank_ac = data.bank_ac || ''; // Ensuring no null for account number

        // Set image previews with conditional check to avoid 'null' in image source
        this.selfPhotoPreview = data.self_photo ? this.filePath + data.self_photo : '';
        this.aadharPhotoPreview = data.aadhar_photo ? this.filePath + data.aadhar_photo : '';
        this.clinicPhotoPreview = data.clinic_photo ? this.filePath + data.clinic_photo : '';
        this.panCardPhotoPreview = data.pan_card_photo_front ? this.filePath + data.pan_card_photo_front : '';

        // Store the data in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
      }

    });
  }

  confirm() {
    const formData = new FormData();

    // Existing form data

    formData.append('first_login', this.userData.firstLogin);

    formData.append('address_line_1', this.address_line_1 || '');
    formData.append('address_line_2', this.address_line_2 || '');
    formData.append('officeAddress', this.officeAddress || '');
    formData.append('homeAddress', this.homeAddress || '');
    formData.append('whatsappNo', this.whatsappNo || '');
    formData.append('emailId', this.emailId || '');
    formData.append('pincode', this.pincode || '');
    formData.append('userId', this.userData.id);
    formData.append('google_map_url', this.googleMapUrl || '');

    formData.append('bank_ifsc', this.bank_ifsc || '');
    formData.append('bank_ac', this.bank_ac || '');

    // New form data
    formData.append('designation', this.designation || '');
    formData.append('degree', this.degree || '');
    formData.append('passoutYear', this.passoutYear || '');
    formData.append('yearsOfExperience', this.yearsOfExperience || '');
    formData.append('achievements', this.achievements || '');
    formData.append('bank_name', this.bankName || '');
    formData.append('instagram_url', this.instagramUrl || '');
    formData.append('linkedin_url', this.linkedinUrl || '');
    formData.append('youtube_url', this.youtubeUrl || '');
    formData.append('facebook_url', this.facebookUrl || '');
    formData.append('website_url', this.websiteUrl || '');
    formData.append('alternative_contact', this.alternativeContact || '');

    formData.append('verificationStatus', this.userData.verificationStatus);

    if (this.selfPhoto) {
      formData.append('self_photo', this.selfPhoto, this.selfPhoto.name);
    }
    if (this.aadharPhoto) {
      formData.append('aadhar_photo', this.aadharPhoto, this.aadharPhoto.name);
    }
    if (this.clinicPhoto) {
      formData.append('clinic_photo', this.clinicPhoto, this.clinicPhoto.name);
    }
    if (this.panCardPhotoFront) {
      formData.append('pan_card_photo_front', this.panCardPhotoFront, this.panCardPhotoFront.name);
    }
    if (this.panCardPhotoBack) {
      formData.append('pan_card_photo_back', this.panCardPhotoBack, this.panCardPhotoBack.name);
    }


    this.userService.updateUserData(this.userData.id, formData).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.invoiceService.showNotification('Profile Updated', 'Profile successfully updated', 'notification-success');
          this.getUserData();
          this.imageFiles = [];
          this.imagePreviews = [];

          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      },
      (err: Error) => {
        this.invoiceService.showNotification('Oops!', 'Something went wrong, please try again later', 'notification-error');
      }
    );
  }

  // Method for canceling the form
  cancelForm() {
    this.getUserData();
    this.editForm = false;
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }
  onFilesSelected(event: any, photoType: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewUrl = e.target.result;

        // Set the appropriate preview variable based on the photo type
        switch (photoType) {
          case 'self_photo':
            this.selfPhotoPreview = previewUrl;
            this.selfPhoto = file;  // Store the file here
            break;
          case 'aadhar_photo':
            this.aadharPhotoPreview = previewUrl;
            this.aadharPhoto = file;  // Store the file here
            break;
          case 'clinic_photo':
            this.clinicPhotoPreview = previewUrl;
            this.clinicPhoto = file;  // Store the file here
            break;
          case 'pan_card_photo_front':
            this.panCardPhotoPreview = previewUrl;
            this.panCardPhotoFront = file;  // Store the file here
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  }


  validForm() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.emailId) {
      if (emailPattern.test(this.emailId)) {
        this.emailError = '';
        if (
          this.officeAddress && this.homeAddress && this.emailId &&
          this.designation && this.degree && this.passoutYear && this.yearsOfExperience &&
          this.selfPhoto && this.aadharPhoto && this.clinicPhoto && this.panCardPhotoFront &&
          this.bank_ifsc && this.bank_ac && this.instagramUrl &&
          this.selfPhoto instanceof File && this.aadharPhoto instanceof File && this.clinicPhoto instanceof File && this.panCardPhotoFront instanceof File
        ) {
        } else {
          return true;
        }
        return true;
      } else {
        this.emailError = 'Enter Valid Email ID';
        return false;
      }
    } else {
      return false;
    }
  }

  initializePassoutYears() {
    const currentYear = new Date().getFullYear();
    const startYear = 1980;  // Example starting year
    this.passoutYears = [];
    for (let year = startYear; year <= currentYear; year++) {
      this.passoutYears.push(year);
    }
  }

  initializeExperienceOptions() {
    this.yearsOfExperienceOptions = [];
    for (let i = 0; i <= 40; i++) {
      this.yearsOfExperienceOptions.push(i); // Adjust the maximum as necessary
    }
  }

  initAutocomplete() {
    const input = this.googleLocationIn.nativeElement;  // Get the input field reference
    const autocomplete = new google.maps.places.Autocomplete(input);

    // Restrict autocomplete to a specific region (optional)
    autocomplete.setFields(['address_components', 'geometry']);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        this.googleLat = place.geometry.location.lat(); // You can save or use the formatted address
        this.googleLong = place.geometry.location.lng();
      }
    });
  }
  onLocationInput(event: any) {
  }
}
