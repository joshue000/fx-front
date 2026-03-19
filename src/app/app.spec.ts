import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

import { App } from './app';
import { TRADES_FEATURE_KEY } from './trades/store/trades.selectors';
import { TradesState } from './trades/store/trades.state';

const initialState: { [TRADES_FEATURE_KEY]: TradesState } = {
  [TRADES_FEATURE_KEY]: {
    trades: [],
    pagination: null,
    loading: false,
    error: null,
    creating: false,
    createError: null,
    selectedTrade: null,
    loadingOne: false,
    loadOneError: null,
    updating: false,
    updateError: null,
    deleting: false,
    deleteError: null,
  },
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render a router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
