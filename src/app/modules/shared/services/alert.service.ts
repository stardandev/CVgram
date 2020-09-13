import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastr: ToastrService
  ) { } 

  displayAlert(type:string, message:string, timeout:number = 3000) {
    switch (type) {
      case 'error':
        this.toastr.error(message,'',{
          timeOut: timeout
        });
        break;
      case 'info':
        this.toastr.info(message,'',{
          timeOut: timeout
        });
        break;
      case 'warning':
        this.toastr.warning(message,'',{
          timeOut: timeout
        });
        break;
      case 'success':
        this.toastr.success(message,'',{
          timeOut: timeout
        });
        break;
    }
  }

  defaultError() {
    this.toastr.error('Something went wrong, If the issue persists contact the administrator');
  }
  defaultFrError() {
    this.toastr.error("Quelque chose s'est mal passé, si le problème persiste, contactez l'administrateur");
  }
}
