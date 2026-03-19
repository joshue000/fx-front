import { Component, inject } from '@angular/core';

import { Lang, TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly translationService = inject(TranslationService);
  readonly themeService = inject(ThemeService);

  readonly currentLang = this.translationService.currentLang;

  onLangChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value as Lang;
    this.translationService.setLanguage(lang);
  }
}
