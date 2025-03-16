import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
let url = environment.registerApiPath;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    "Accept": "*/*",
    'Content-Type': 'application/json',
    'api-key': 'dsnvjkn2398jfsd9c803lm'
  });
  login(data: any) {
    return this.http.post(url + 'api/login', data, { headers: this.headers })
  }

  register(data: any) {
    return this.http.post(url + 'register', data, { headers: this.headers })
  }

  setData(key: string, data: any) {
    const d = JSON.stringify(data);
    localStorage.setItem(key, d);
  }

  getData(key: string) {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }


  getUsers() {
    return this.http.get(url + 'userList', { headers: this.headers })
  }
  addUser(data: any) {
    return this.http.post(url + 'addUser', data, { headers: this.headers })
  }
  updateUser(id: number) {
    return this.http.get(url + 'updateUser/' + id, { headers: this.headers })
  }
  updateUserData(id: number, data: any) {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'api-key': 'dsnvjkn2398jfsd9c803lm'
    });

    return this.http.post(url + 'api/updateUserData/' + id, data, { headers: headers })
  }
  deleteUserData(id: number, data: any) {
    let delData = {
      userId: id,
      delete: data
    }
    return this.http.post(url + 'deleteUserData/' + id, delData, { headers: this.headers })
  }
  changePassword(data: any) {
    return this.http.post(url + 'api/updatePassword', data, { headers: this.headers })
  }
  resetPassword(data: any) {
    return this.http.post(url + 'api/resetPassword', data, { headers: this.headers })
  }
  listCurrency() {
    return this.http.get(url + 'currencyList', { headers: this.headers })
  }
  userData(id: number) {
    return this.http.get(url + 'api/getUser/' + id, { headers: this.headers })
  }
  getCountryList() {
    return this.http.get(url + 'api/countryList', { headers: this.headers })
  }
  subscribe(data: any) {
    return this.http.post(url + 'subscribe/add_subscription', data, { headers: this.headers })
  }
  updateSubscribe(data: any) {
    return this.http.post(url + 'subscribe/update_subscription', data, { headers: this.headers })
  }
  verifySubscribe(data: any) {
    return this.http.post(url + 'subscribe/verify_subscription', data, { headers: this.headers })
  }
  get_subscriptions(userId: any) {
    return this.http.get(url + 'api/get_user_subscription/' + userId, { headers: this.headers })
  }

  get_subscriptions_all() {
    return this.http.get(url + 'api/get_all_subscription/', { headers: this.headers })
  }

  getRooms(userId: any, roomId: any = 0) {
    return this.http.get(url + 'api/get_room/' + userId + '/' + roomId, { headers: this.headers })
  }
  getRoomTypes() {
    return this.http.get(url + 'api/get_room_types/', { headers: this.headers })
  }

  addRoom(room: any) {
    return this.http.post<any>(url + 'api/save_room', room, { headers: this.headers });
  }

  updateRoom(room: any, roomId: number | string = '') {
    return this.http.put<any>(url + 'api/save_room/' + roomId, room, { headers: this.headers });
  }

  verifyUser(data: any, roomId: number | string = '') {
    return this.http.post<any>(url + 'api/updateVerificationStatus/' + roomId, data, { headers: this.headers });
  }

  updateStatus(userId: any, status: boolean) {
    const data = {
      userId: userId,
      status: status
    }
    return this.http.post(url + 'api/updateStatus', data, { headers: this.headers });
  }


  getVendorsList() {
    return this.http.get(url + 'api/get_vendors_list', { headers: this.headers });
  }

  getOtpPendingHotelsList() {
    return this.http.get(url + 'api/get_otp_pending_users', { headers: this.headers });
  }

  getCities() {
    return this.http.get(url + 'api/get_cities', { headers: this.headers });
  }

  // Get a specific city
  getCity(id: number) {
    return this.http.get(url + 'api/get_city/' + id, { headers: this.headers });
  }

  // Add a new city
  addCity(city: any) {
    return this.http.post(url + 'api/add_city/', city, { headers: this.headers });
  }

  // Update an existing city
  updateCity(id: number, city: any) {
    return this.http.post(url + 'api/update_city/' + id, city, { headers: this.headers });
  }
  // Get a specific segment by ID
  getSegments(): Observable<any> {
    return this.http.get(url + 'api/get_segments/', { headers: this.headers });
  }

  getPlans(): Observable<any> {
    return this.http.get(url + 'api/get_plans/', { headers: this.headers });
  }

  // Add a new segment
  addSegment(segment: any): Observable<any> {
    return this.http.post(url + 'api/add_segment', segment, { headers: this.headers });
  }

  // Update an existing segment
  updateSegment(id: number, segment: any): Observable<any> {
    return this.http.post(url + 'api/update_segment/' + id, segment, { headers: this.headers });
  }

  deleteCity(id: number) {
    return this.http.get(url + 'api/delete_city/' + id, { headers: this.headers });
  }

  removeImage(id: any) {
    return this.http.get(url + 'api/delete_hotel_image/' + id, { headers: this.headers });
  }

  add_onboarding_order(data: any) {
    return this.http.post(url + 'subscribe/add_onboarding_order', data, { headers: this.headers })
  }
  verify_onboarding_payment(data: any) {
    return this.http.post(url + 'subscribe/verify_onboarding_payment', data, { headers: this.headers })
  }

  get_onboarding_data(): Observable<any> {
    return this.http.get(url + 'api/get_onboarding_list/', { headers: this.headers });
  }

  update_user_admin(data: any){
    return this.http.post(url + 'api/update_user_admin/', data, { headers: this.headers });
  }
}
