import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('pages getter', () => {
    it('should return all pages when totalPages <= 7', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      expect(component.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return ellipsis near the end when current page is near the start', () => {
      component.currentPage = 2;
      component.totalPages = 12;
      const pages = component.pages;
      expect(pages[0]).toBe(1);
      expect(pages[pages.length - 1]).toBe(12);
      expect(pages).toContain('...');
    });

    it('should return ellipsis on both sides when current page is in the middle', () => {
      component.currentPage = 6;
      component.totalPages = 12;
      const pages = component.pages;
      expect(pages[0]).toBe(1);
      expect(pages[pages.length - 1]).toBe(12);
      expect(pages.filter(p => p === '...').length).toBe(2);
    });

    it('should return ellipsis near the start when current page is near the end', () => {
      component.currentPage = 11;
      component.totalPages = 12;
      const pages = component.pages;
      expect(pages[0]).toBe(1);
      expect(pages[pages.length - 1]).toBe(12);
      expect(pages).toContain('...');
    });
  });

  describe('hasPrevious / hasNext', () => {
    it('should report hasPrevious false on first page', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      expect(component.hasPrevious).toBeFalse();
    });

    it('should report hasPrevious true on any page > 1', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      expect(component.hasPrevious).toBeTrue();
    });

    it('should report hasNext false on last page', () => {
      component.currentPage = 5;
      component.totalPages = 5;
      expect(component.hasNext).toBeFalse();
    });

    it('should report hasNext true when not on last page', () => {
      component.currentPage = 3;
      component.totalPages = 5;
      expect(component.hasNext).toBeTrue();
    });
  });

  describe('goTo', () => {
    it('should emit pageChange with the requested page', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      const emitSpy = spyOn(component.pageChange, 'emit');

      component.goTo(3);

      expect(emitSpy).toHaveBeenCalledWith(3);
    });

    it('should not emit when the requested page equals the current page', () => {
      component.currentPage = 3;
      component.totalPages = 5;
      const emitSpy = spyOn(component.pageChange, 'emit');

      component.goTo(3);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when the requested page is out of range', () => {
      component.currentPage = 1;
      component.totalPages = 5;
      const emitSpy = spyOn(component.pageChange, 'emit');

      component.goTo(0);
      component.goTo(6);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('previous / next', () => {
    it('should emit currentPage - 1 when previous is called', () => {
      component.currentPage = 3;
      component.totalPages = 5;
      const emitSpy = spyOn(component.pageChange, 'emit');

      component.previous();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should emit currentPage + 1 when next is called', () => {
      component.currentPage = 3;
      component.totalPages = 5;
      const emitSpy = spyOn(component.pageChange, 'emit');

      component.next();

      expect(emitSpy).toHaveBeenCalledWith(4);
    });
  });

  describe('template', () => {
    it('should disable the previous button on the first page', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      fixture.detectChanges();

      const prevBtn = fixture.nativeElement.querySelector('[aria-label="Previous page"]');
      expect(prevBtn.disabled).toBeTrue();
    });

    it('should disable the next button on the last page', () => {
      component.currentPage = 3;
      component.totalPages = 3;
      fixture.detectChanges();

      const nextBtn = fixture.nativeElement.querySelector('[aria-label="Next page"]');
      expect(nextBtn.disabled).toBeTrue();
    });

    it('should mark the current page button with aria-current="page"', () => {
      component.currentPage = 2;
      component.totalPages = 3;
      fixture.detectChanges();

      const activeBtn = fixture.nativeElement.querySelector('[aria-current="page"]');
      expect(activeBtn).not.toBeNull();
      expect(activeBtn.textContent.trim()).toBe('2');
    });
  });
});
