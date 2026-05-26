import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { VideoApi, VideoStatusResponse } from './services/video-api';

describe('App', () => {
  const status: VideoStatusResponse = {
    operation: 'IDLE',
    state: 'IDLE',
    progress: 0,
    running: false,
    message: 'Preparado.',
    logs: [],
    startedAt: null,
    finishedAt: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: VideoApi,
          useValue: {
            status: () => of(status),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('generate_videos_tiktok');
  });
});
