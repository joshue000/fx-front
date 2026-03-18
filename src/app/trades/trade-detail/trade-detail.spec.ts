import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';

import { TradeDetail } from './trade-detail';

const buildActivatedRoute = (id: string | null) => ({
  snapshot: {
    paramMap: {
      get: (_key: string) => id,
    },
  },
});

describe('TradeDetail', () => {
  describe('with a valid route id', () => {
    let component: TradeDetail;
    let fixture: ComponentFixture<TradeDetail>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TradeDetail],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: buildActivatedRoute('42') },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TradeDetail);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should read the trade id from the route params', () => {
      expect(component['tradeId']()).toBe('42');
    });

    it('should render the trade id in the template', () => {
      const idElement = fixture.nativeElement.querySelector('.trade-detail__id');
      expect(idElement.textContent.trim()).toBe('ID: 42');
    });

    it('should navigate back to trades list when goBack is called', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/trades']);
    });
  });

  describe('with a null route id', () => {
    let component: TradeDetail;
    let fixture: ComponentFixture<TradeDetail>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TradeDetail],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: buildActivatedRoute(null) },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TradeDetail);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should default tradeId to empty string when param is null', () => {
      expect(component['tradeId']()).toBe('');
    });
  });
});
