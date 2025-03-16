import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-vendor-edit-modal',
  templateUrl: './vendor-edit-modal.component.html',
  styleUrls: ['./vendor-edit-modal.component.scss']
})
export class VendorEditModalComponent implements OnInit {
  vendorForm!: FormGroup;
  vendorData: any = {};
  cityList: any[] = [];
  segmentList: any[] = [];

  segmentName: string = '';
  cityName: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    public dialogRef: MatDialogRef<VendorEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the form with default values or values from data
   */
  initForm() {
    const hotelData = this.data.hotelData || {};
    this.vendorForm = this.fb.group({
      user_id: [hotelData.user_id || '', Validators.required],
      user_name: [hotelData.user_name || '', Validators.required],
      emailId: [{ value: hotelData.emailId || '', disabled: true }, [Validators.email]],
      phoneNumber: [{ value: hotelData.phoneNumber || '', disabled: true }, [Validators.pattern(/^[0-9]{10}$/)]], // Disabled
      accountStatus: [hotelData.accountStatus || '', Validators.required],
      verificationStatus: [hotelData.verificationStatus || '', Validators.required],
      addedOn: [hotelData.addedOn || ''],
      designation: [hotelData.Designation || ''],
      homeAddress: [hotelData.homeAddress || ''],
      officeAddress: [hotelData.officeAddress || ''],
      degree: [hotelData.Degree || ''],
      passoutYear: [hotelData.passoutYear || ''],
      yearsOfExperience: [hotelData.yearsOfExperience || ''],
      city_name: [hotelData.city_name || '', Validators.required],
      segment_name: [hotelData.segment_name || '', Validators.required],

      instagram_url: [hotelData.instagram_url || ''],
      linkedin_url: [hotelData.linkedin_url || ''],
      youtube_url: [hotelData.youtube_url || ''],
      facebook_url: [hotelData.facebook_url || ''],
      website_url: [hotelData.website_url || ''],
      google_map_url: [hotelData.google_map_url || ''],
      alternative_contact: [hotelData.alternative_contact || '', [Validators.pattern(/^[0-9]{10}$/)]],
    });
    this.loadDropdownData();
  }

  /**
   * Load segment and city list from API before loading vendor data
   */
  loadDropdownData() {
    this.usersService.getCountryList().subscribe((res: any) => {
      if (res.status == 200) {
        this.cityList = res.res.cities || [];
        this.segmentList = res.res.segments || [];

        // After loading the dropdown lists, load vendor data
        this.loadVendorData();
      }
    });
  }

  /**
   * Load vendor data from API and set selected dropdown values
   */
  loadVendorData() {
    this.usersService.userData(this.data.hotelData.user_id).subscribe((res: any) => {
      if (res.status == 200 && res.data) {
        this.vendorData = res.data;

        this.vendorForm.patchValue({
          user_id: this.vendorData.id || '',
          user_name: this.vendorData.name || '',
          emailId: this.vendorData.emailId || '',
          phoneNumber: this.vendorData.phoneNumber || '',
          accountStatus: this.vendorData.accountStatus || '',
          verificationStatus: this.vendorData.verificationStatus || '',
          addedOn: this.vendorData.addedOn || '',
          designation: this.vendorData.Designation || '',
          homeAddress: this.vendorData.homeAddress || '',
          officeAddress: this.vendorData.officeAddress || '',
          degree: this.vendorData.Degree || '',
          passoutYear: this.vendorData.passoutYear || '',
          yearsOfExperience: this.vendorData.yearsOfExperience || '',
          instagram_url: this.vendorData.instagram_url || '',
          linkedin_url: this.vendorData.linkedin_url || '',
          youtube_url: this.vendorData.youtube_url || '',
          facebook_url: this.vendorData.facebook_url || '',
          website_url: this.vendorData.website_url || '',
          google_map_url: this.vendorData.google_map_url || '',
          alternative_contact: this.vendorData.alternative_contact || '',
        });


        this.setSelectedSegment();
        this.setSelectedCity();
      }
    });
  }

  setSelectedSegment() {
    if (!this.segmentList.length || !this.vendorData.segment_name) return;

    const selectedSegment = this.segmentList.find(segment => segment.segement === this.vendorData.segment_name);
    if (selectedSegment) {
      this.vendorForm.patchValue({ segment_name: selectedSegment.id });
    }
  }

  setSelectedCity() {
    if (!this.cityList.length || !this.vendorData.city_name) return;

    const selectedCity = this.cityList.find(city => city.city_name === this.vendorData.city_name);
    if (selectedCity) {
      this.vendorForm.patchValue({ city_name: selectedCity.id });
    }
  }


  updateSegment(event: any) {
    this.vendorForm.patchValue({ segment_name: event.value });
  }

  updateCity(event: any) {
    this.vendorForm.patchValue({ city_name: event.value });
  }

  onSubmit() {
    if(confirm("Confirm Changes?, This Can't be undone!")){
      if (this.vendorForm.valid) {
        const updatedData = { id: this.vendorForm.value.user_id, ...this.vendorForm.value };
        this.usersService.update_user_admin(updatedData).subscribe(
          (res) => this.dialogRef.close(res),
          (err) => console.error('Error updating vendor:', err)
        );
      }
    }else{
      return;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
