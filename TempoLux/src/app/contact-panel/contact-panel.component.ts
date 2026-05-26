import { Component, Input, inject } from '@angular/core';
import { LanguageService } from '../language.service';
import { Watch } from '../watch';

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
})
export class ContactPanelComponent {
  @Input() selectedWatch: Watch | null = null;

  readonly language = inject(LanguageService);

  selectedMessage(): string {
    return this.selectedWatch ? this.language.localize(this.selectedWatch.name) : '';
  }
}
