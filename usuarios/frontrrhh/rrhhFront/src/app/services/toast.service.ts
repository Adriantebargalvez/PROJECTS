import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastMessage, ToastType } from '../models/toast.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastSubject.asObservable();

  success(title: string, message: string): void {
    this.pushToast('success', title, message);
  }

  error(title: string, message: string): void {
    this.pushToast('error', title, message);
  }

  info(title: string, message: string): void {
    this.pushToast('info', title, message);
  }

  dismiss(id: number): void {
    this.toastSubject.next(this.toastSubject.value.filter((toast) => toast.id !== id));
  }

  private pushToast(type: ToastType, title: string, message: string): void {
    const toast: ToastMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      title,
      message
    };

    this.toastSubject.next([...this.toastSubject.value, toast]);

    window.setTimeout(() => {
      this.dismiss(toast.id);
    }, 3800);
  }
}
