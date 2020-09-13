import { Injectable } from '@angular/core';
import { CONSTATNTS } from '../Utils/Constatns';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  currentLanguage = new BehaviorSubject<string>('');

  currentJob = new BehaviorSubject<any>({});

  constructor() { }

  getCurrentLanguage() {
    return this.currentLanguage.asObservable();
  }

  updateCurrentLanuage(language) {
    this.currentLanguage.next(language);
    localStorage.setItem(CONSTATNTS.CURRENT_LANGUAGE, language);
  }


  getCurrentJob = () => <Observable<any>>this.currentJob.asObservable();
  
  setCurrentJob = (job) => this.currentJob.next(job);



  clearUser() {
    localStorage.removeItem(CONSTATNTS.CURRENT_LANGUAGE);
  }


}
