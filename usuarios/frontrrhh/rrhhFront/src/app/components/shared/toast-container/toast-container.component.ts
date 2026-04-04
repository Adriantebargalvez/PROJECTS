import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastMessage } from 'src/app/models/toast.models';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent {
  readonly toasts$: Observable<ToastMessage[]> = this.toastService.toasts$;

  constructor(private readonly toastService: ToastService) {}

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  getIcon(type: ToastMessage['type']): string {
    const icons = {
      success: 'bi-check2-circle',
      error: 'bi-exclamation-triangle',
      info: 'bi-info-circle'
    };

    return icons[type];
  }
}
