import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

export type Lang = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);

  private readonly _currentLang = signal<Lang>('en');
  private readonly _translations = signal<Record<string, string>>({});

  readonly currentLang = this._currentLang.asReadonly();

  constructor() {
    this.setLanguage('en');
  }

  setLanguage(lang: Lang): void {
    this.http
      .get<Record<string, string>>(`/languages/${lang}.json`)
      .pipe(catchError(() => EMPTY))
      .subscribe(translations => {
        this._translations.set(translations);
        this._currentLang.set(lang);
      });
  }

  translate(key: string, params?: Record<string, string | number>): string {
    let text = this._translations()[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  }
}
