import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoApi, VideoStatusResponse } from './services/video-api';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  selectedFiles: File[] = [];
  outputPath = 'C:\\Users\\Adrian\\Documents\\GitHub\\PROJECTS\\generate_videos_tiktok\\data';
  randomCount = 10;
  validationError = '';
  feedbackMessage = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  status: VideoStatusResponse = {
    operation: 'IDLE',
    state: 'IDLE',
    progress: 0,
    running: false,
    message: 'Preparado.',
    logs: [],
    startedAt: null,
    finishedAt: null,
  };

  private pollingId?: number;

  constructor(private readonly videoApi: VideoApi) {
    this.refreshStatus();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = Array.from(input.files ?? []);
    this.validateFiles();
  }

  upload(): void {
    if (!this.validateFiles() || !this.validatePath()) {
      return;
    }

    this.feedback('info', 'Subiendo videos...');
    this.videoApi.upload(this.selectedFiles, this.outputPath.trim()).subscribe({
      next: (response) => {
        this.status = response.status;
        this.feedback('success', response.message);
      },
      error: (error) => this.handleError(error),
    });
  }

  convert(): void {
    this.startProcess('convert');
  }

  cut(): void {
    this.startProcess('cut');
  }

  mix(): void {
    this.startProcess('mix');
  }

  generateRandom(): void {
    this.startProcess('random');
  }

  runAll(): void {
    this.startProcess('runAll');
  }

  clean(): void {
    if (!this.validatePath()) {
      return;
    }

    this.feedback('info', 'Limpiando temporales...');
    this.videoApi.clean(this.outputPath.trim()).subscribe({
      next: (status) => {
        this.status = status;
        this.feedback('success', status.message);
      },
      error: (error) => this.handleError(error),
    });
  }

  refreshStatus(stopWhenDone = false): void {
    this.videoApi.status().subscribe({
      next: (status) => {
        this.status = status;
        if (status.state === 'ERROR') {
          this.feedback('error', status.message);
          this.stopPolling();
        } else if (stopWhenDone && !status.running) {
          this.feedback('success', status.message);
          this.stopPolling();
        }
      },
      error: () => {
        this.feedback('error', 'No se pudo conectar con el backend.');
        this.stopPolling();
      },
    });
  }

  isBusy(): boolean {
    return this.status.running;
  }

  canUpload(): boolean {
    return !this.isBusy() && this.selectedFiles.length > 0 && !this.validationError && this.outputPath.trim().length > 0;
  }

  fileNames(): string {
    return this.selectedFiles.map((file) => file.name).join(', ');
  }

  private startProcess(action: 'convert' | 'cut' | 'mix' | 'random' | 'runAll'): void {
    if (!this.validatePath()) {
      return;
    }
    if ((action === 'random' || action === 'runAll') && !this.validateRandomCount()) {
      return;
    }

    const request = {
      outputPath: this.outputPath.trim(),
      randomCount: this.randomCount,
    };
    const request$ = {
      convert: this.videoApi.convert(request),
      cut: this.videoApi.cut(request),
      mix: this.videoApi.mix(request),
      random: this.videoApi.random(request),
      runAll: this.videoApi.runAll(request),
    }[action];

    this.feedback('info', 'Proceso iniciado...');
    request$.subscribe({
      next: (status) => {
        this.status = status;
        this.startPolling();
      },
      error: (error) => this.handleError(error),
    });
  }

  private validateFiles(): boolean {
    this.validationError = '';
    if (this.selectedFiles.length === 0) {
      return true;
    }
    if (this.selectedFiles.some((file) => !file.name.toLowerCase().endsWith('.mp4'))) {
      this.validationError = 'Solo se permiten archivos MP4.';
      return false;
    }
    if (this.selectedFiles.length % 3 !== 0) {
      this.validationError = 'Selecciona una cantidad de videos en multiplos de 3.';
      return false;
    }
    return true;
  }

  private validatePath(): boolean {
    if (!this.outputPath.trim()) {
      this.feedback('error', 'Indica una ruta de salida.');
      return false;
    }
    return true;
  }

  private validateRandomCount(): boolean {
    if (!Number.isInteger(this.randomCount) || this.randomCount < 1) {
      this.feedback('error', 'Indica una cantidad random mayor que cero.');
      return false;
    }
    return true;
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollingId = window.setInterval(() => this.refreshStatus(true), 1500);
  }

  private stopPolling(): void {
    if (this.pollingId) {
      window.clearInterval(this.pollingId);
      this.pollingId = undefined;
    }
  }

  private feedback(type: 'success' | 'error' | 'info', message: string): void {
    this.feedbackType = type;
    this.feedbackMessage = message;
  }

  private handleError(error: unknown): void {
    const response = error as { error?: { message?: string }; message?: string };
    const message = response.error?.message ?? response.message ?? 'Error inesperado.';
    this.feedback('error', message);
  }
}
