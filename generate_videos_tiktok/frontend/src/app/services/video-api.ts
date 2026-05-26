import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface VideoStatusResponse {
  operation: string;
  state: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR' | string;
  progress: number;
  running: boolean;
  message: string;
  logs: string[];
  startedAt: string | null;
  finishedAt: string | null;
}

export interface UploadResponse {
  message: string;
  uploadedFiles: number;
  outputPath: string;
  status: VideoStatusResponse;
}

export interface ProcessRequest {
  outputPath: string;
  randomCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class VideoApi {
  private readonly baseUrl = '/api/videos';

  constructor(private readonly http: HttpClient) {}

  upload(files: File[], outputPath: string): Observable<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('outputPath', outputPath);
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData);
  }

  convert(request: ProcessRequest): Observable<VideoStatusResponse> {
    return this.http.post<VideoStatusResponse>(`${this.baseUrl}/convert`, request);
  }

  cut(request: ProcessRequest): Observable<VideoStatusResponse> {
    return this.http.post<VideoStatusResponse>(`${this.baseUrl}/cut`, request);
  }

  mix(request: ProcessRequest): Observable<VideoStatusResponse> {
    return this.http.post<VideoStatusResponse>(`${this.baseUrl}/mix`, request);
  }

  random(request: ProcessRequest): Observable<VideoStatusResponse> {
    return this.http.post<VideoStatusResponse>(`${this.baseUrl}/random`, request);
  }

  runAll(request: ProcessRequest): Observable<VideoStatusResponse> {
    return this.http.post<VideoStatusResponse>(`${this.baseUrl}/run-all`, request);
  }

  clean(outputPath: string): Observable<VideoStatusResponse> {
    const params = new HttpParams().set('outputPath', outputPath);
    return this.http.delete<VideoStatusResponse>(`${this.baseUrl}/clean`, { params });
  }

  status(): Observable<VideoStatusResponse> {
    return this.http.get<VideoStatusResponse>(`${this.baseUrl}/status`);
  }
}
