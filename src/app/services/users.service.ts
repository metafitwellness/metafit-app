import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
let url = environment.registerApiPath;

const html2pdf = require('html2pdf.js');
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  urls = url;

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

  imagePath(path: string) {
    if (path == null || path == '') {
      return null;
    } else {
      return url + 'uploads/images/' + path;
    }
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

  update_user_admin(data: any) {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'api-key': 'dsnvjkn2398jfsd9c803lm'
    });
    return this.http.post(url + 'api/update_user_admin/', data, { headers: headers });
  }

  editFooterLink(id: any, data: any) {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'api-key': 'dsnvjkn2398jfsd9c803lm'
    });
    return this.http.post(url + 'api/updateSeoPage/' + id, data, { headers: headers })
  }

  addFooterLink(data: any) {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'api-key': 'dsnvjkn2398jfsd9c803lm'
    });
    return this.http.post(url + 'api/addSeoPage', data, { headers: headers })
  }

  getSeoPages(page: any = '') {
    return this.http.get(url + 'api/getSeoPages?id=' + page, { headers: this.headers });
  }

  updateBlog(id: any, data: any) {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'api-key': 'dsnvjkn2398jfsd9c803lm'
    });
    return this.http.post(url + 'api/updateBlog/' + id, data, { headers: headers })
  }

  addBlog(data: any) {
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'api-key': 'dsnvjkn2398jfsd9c803lm'
    });
    return this.http.post(url + 'api/addBlog', data, { headers: headers })
  }

  getBlogs(page: any = '') {
    return this.http.get(url + 'api/getBlogs?id=' + page, { headers: this.headers });
  }

  printPdf(documentId: string, fileName: string, fromDate: string = '', toDate: string = '', filters: { [key: string]: any }[], print: boolean = false, additionalDiv: any = null) {
    const element = document.getElementById(documentId);
    if (!element) {
      console.error("Element not found");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 6;
    const pageWidth = 297 - 2 * margin;
    let yPos = margin;

    // **Add Logo**
    const logoheight = 0;
    const logoWidth = 0;
    // **Add Report Details**
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('META FIT', margin + logoWidth + 5, margin + 10);
    doc.setFontSize(14);
    doc.text('Report: ' + fileName, margin + logoWidth + 5, yPos);
    yPos += 8;

    // **Date Range**
    doc.setFontSize(12);
    doc.setTextColor(100);
    yPos += 8;

    // **Filters**
    doc.setFontSize(10);
    doc.setTextColor(50);
    if (filters.length > 0) {
      let filterText = '';
      filters.forEach(filter => {
        const key = Object.keys(filter)[0];
        const values = Array.isArray(filter[key]) && filter[key][0].length > 0
          ? filter[key].join(', ')
          : "ALL";
        filterText += `${key.toUpperCase()}: ${values} | `;
      });

      doc.text(filterText.slice(0, -2), margin, yPos, { maxWidth: pageWidth });
      yPos += 10;
    }

    // **Report Printed On**
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Printed On: ${this.formatDate(new Date())}`, margin, yPos);
    yPos += 8;

    if (additionalDiv) {
      const summaryDiv = document.getElementById(additionalDiv);
      if (summaryDiv) {
        html2canvas(summaryDiv, { scale: 2 })
          .then((canvas: any) => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imgData, "PNG", margin, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 5;

            // Continue with the table extraction after the div is added
            this.addTableToPDF(doc, element, yPos, pageWidth, margin, fileName, print);
          })
          .catch((error: any) => {
            console.error("Error capturing the div with html2canvas:", error);
            // Continue with the table extraction in case of error with html2canvas
            this.addTableToPDF(doc, element, yPos, pageWidth, margin, fileName, print);
          });
      } else {
        console.error("Summary div not found with id:", additionalDiv);
        // Continue with the table extraction if div not found
        this.addTableToPDF(doc, element, yPos, pageWidth, margin, fileName, print);
      }
    } else {
      // No additional div, continue directly with the table extraction
      this.addTableToPDF(doc, element, yPos, pageWidth, margin, fileName, print);
    }
  }

  addTableToPDF(doc: jsPDF, element: HTMLElement, yPos: number, pageWidth: number, margin: number, fileName: string, print: boolean) {
    let data: any[] = [];
    let headers: any[] = [];

    const table = element.querySelector("table");
    if (table) {
      const headerCells = table.querySelectorAll("thead tr th");
      headers = Array.from(headerCells).map((th: any) => th.innerText.trim());

      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row: any) => {
        const rowData = Array.from(row.querySelectorAll("td")).map((td: any) => td.innerText.trim());
        data.push(rowData);
      });

      // **Add Table to PDF**
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: yPos + 5,
        margin: { left: margin, right: margin, bottom: 20 },
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [52, 152, 219], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        tableWidth: 'auto',
      });

      if (print) {
        // **Print PDF (Auto opens print dialog)**
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl, '_blank');

        if (printWindow) {
          printWindow.onload = function () {
            printWindow.focus();
            printWindow.print();
          };
        }
      } else {
        // **Download PDF**
        doc.save(`${fileName}.pdf`);
      }
    } else {
      console.error("No table found inside the element");
    }
  }

  exportToExcel(documentId: string, fileName: string) {
    const element = document.getElementById(documentId);
    if (!element) {
      console.error("Element not found");
      return;
    }

    const table = element.querySelector("table");
    if (table) {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      console.error("No table found inside the element");
    }

  }

  formatDate(date: any) {
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options);
  }

}
