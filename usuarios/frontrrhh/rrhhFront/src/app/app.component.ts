import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
              transform: 'translateY(16px)'
            })
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            animate(
              '180ms ease-in',
              style({
                opacity: 0,
                transform: 'translateY(-12px)'
              })
            )
          ],
          { optional: true }
        ),
        query(
          ':enter',
          [
            animate(
              '260ms 80ms ease-out',
              style({
                opacity: 1,
                transform: 'translateY(0)'
              })
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class AppComponent {
  title = 'rrhhFront';

  prepareRoute(outlet: RouterOutlet): string | null {
    return outlet?.activatedRouteData?.['animation'] ?? null;
  }
}
