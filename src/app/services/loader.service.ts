import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false);
  loaderState$ = this.loaderSubject.asObservable();  // To subscribe to the loader state

  showLoader() {
    this.loaderSubject.next(true);  // Show loader
  }

  hideLoader() {
    this.loaderSubject.next(false);  // Hide loader
  }
}
