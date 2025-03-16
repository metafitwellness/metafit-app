import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from './../../services/users.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotelmodal',
  templateUrl: './hotelmodal.component.html',
  styleUrls: ['./hotelmodal.component.scss']
})
export class HotelmodalComponent implements OnInit {
  hotelData: any;
  subscriptions: any[] = [];
  rooms: any[] = [];
  imageUploads: any = [];
  filePath: string = '';
  verificationStatus: string = 'approved'; // Default selected value
  verificationRemark: string = '';


  constructor(
    private usersService: UsersService,
    public dialogRef: MatDialogRef<HotelmodalComponent>,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.hotelData = this.data.hotelData;
    this.filePath = environment.uploadPath + 'images/';
    this.loadHotelData();
    this.loadSubscriptions(this.data.hotelData.user_id);
  }

  loadHotelData() {
    this.usersService.userData(this.data.hotelData.user_id).subscribe((res: any) => {
      this.hotelData = res.data;
      this.verificationStatus = this.hotelData.verificationStatus;
      this.imageUploads = res.data.images;
    });
  }

  loadSubscriptions(userId: any) {
    this.usersService.get_subscriptions(userId).subscribe((res: any) => {
      this.subscriptions = res.data;
    });
  }


  closeModal() {
    this.dialogRef.close();
  }

  openImageInNewTab(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  // This method is triggered when the select value changes
  onVerificationStatusChange() {
    if (this.verificationStatus === 'approved') {
      this.verificationRemark = '';  // Clear remark when 'Approve' is selected
    }
  }

  // This method checks whether the form is valid before allowing submission
  isFormValid(): boolean {
    // If 'Reject' is selected, the verificationRemark field is required
    if (this.verificationStatus === 'rejected' && !this.verificationRemark) {
      return false;
    }
    return true;
  }

  // Submit the form
  submitForm() {
    // Check if the form is valid
    if (!this.isFormValid()) {
      // Handle validation error (e.g., show a message)
      alert('Verification Remark is required for rejection');
      return;
    }
    const data = {
      userId: this.hotelData.id,
      verificationStatus: this.verificationStatus,
      verificationRemark: this.verificationRemark,
      planAmount: this.hotelData.onboardingAmount

    }
    this.usersService.verifyUser(data, data.userId).subscribe((res: any) => {
      this.loadHotelData();
    });
  }
}
