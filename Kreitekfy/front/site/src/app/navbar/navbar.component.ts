import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { AudioService } from '../audio/audio.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userLabel = 'Cuenta';
  userInitial = 'K';
  isMobileViewport = false;
  isHiddenByScroll = false;
  isCompact = false;

  private lastScrollTop = 0;
  private readonly mobileBreakpoint = 720;
  private readonly scrollThreshold = 12;

  constructor(
    private authService: AuthService,
    private router: Router,
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    this.updateViewportState();

    this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.getUser().subscribe(user => {
      const label = user.firstName || user.username || 'Cuenta';
      this.userLabel = label;
      this.userInitial = label.charAt(0).toUpperCase() || 'K';
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewportState();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isMobileViewport) {
      this.isHiddenByScroll = false;
      this.isCompact = false;
      return;
    }

    const currentScrollTop = Math.max(window.scrollY || 0, 0);
    const scrollDelta = currentScrollTop - this.lastScrollTop;

    this.isCompact = currentScrollTop > 8;

    if (Math.abs(scrollDelta) < this.scrollThreshold) {
      return;
    }

    if (scrollDelta > 0 && currentScrollTop > 96) {
      this.isHiddenByScroll = true;
    } else if (scrollDelta < 0) {
      this.isHiddenByScroll = false;
    }

    this.lastScrollTop = currentScrollTop;
  }

  logout(): void {
    this.audioService.stop();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout', error);
        this.router.navigate(['/login']);
      }
    });
  }

  private updateViewportState(): void {
    this.isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= this.mobileBreakpoint;
    this.lastScrollTop = typeof window !== 'undefined' ? Math.max(window.scrollY || 0, 0) : 0;

    if (!this.isMobileViewport) {
      this.isHiddenByScroll = false;
      this.isCompact = false;
    } else {
      this.isCompact = this.lastScrollTop > 8;
    }
  }
}
