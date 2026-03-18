import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';

import { OrderDetail } from './order-detail';

const buildActivatedRoute = (id: string | null) => ({
  snapshot: {
    paramMap: {
      get: (_key: string) => id,
    },
  },
});

describe('OrderDetail', () => {
  describe('with a valid route id', () => {
    let component: OrderDetail;
    let fixture: ComponentFixture<OrderDetail>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [OrderDetail],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: buildActivatedRoute('42') },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OrderDetail);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should read the order id from the route params', () => {
      expect(component['orderId']()).toBe('42');
    });

    it('should render the order id in the template', () => {
      const idElement = fixture.nativeElement.querySelector('.order-detail__id');
      expect(idElement.textContent.trim()).toBe('ID: 42');
    });

    it('should navigate back to orders list when goBack is called', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/trades']);
    });
  });

  describe('with a null route id', () => {
    let component: OrderDetail;
    let fixture: ComponentFixture<OrderDetail>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [OrderDetail],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: buildActivatedRoute(null) },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OrderDetail);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should default orderId to empty string when param is null', () => {
      expect(component['orderId']()).toBe('');
    });
  });
});
