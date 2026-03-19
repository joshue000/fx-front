import { Component, inject } from '@angular/core';

import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinner {
  readonly themeService = inject(ThemeService);
}
