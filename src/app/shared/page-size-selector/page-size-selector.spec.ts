import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PageSizeSelector, PAGE_SIZE_OPTIONS } from './page-size-selector';

describe('PageSizeSelector', () => {
  let component: PageSizeSelector;
  let fixture: ComponentFixture<PageSizeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSizeSelector],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PageSizeSelector);
    component = fixture.componentInstance;
    component.pageSize = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the PAGE_SIZE_OPTIONS constant', () => {
    expect(component.options).toEqual(PAGE_SIZE_OPTIONS);
  });

  it('should render an option for each page size', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(PAGE_SIZE_OPTIONS.length);
    expect(options[0].value).toBe('5');
    expect(options[1].value).toBe('10');
    expect(options[2].value).toBe('20');
  });

  it('should reflect the current pageSize input in the select value', () => {
    component.pageSize = 20;
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(Number(select.value)).toBe(20);
  });

  it('should emit pageSizeChange with the selected numeric value on change', () => {
    const emitSpy = spyOn(component.pageSizeChange, 'emit');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');

    select.value = '20';
    select.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(20);
  });
});
