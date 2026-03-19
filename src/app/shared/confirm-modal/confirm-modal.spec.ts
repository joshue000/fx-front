import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default message', () => {
    const message = fixture.nativeElement.querySelector('.modal__message');
    expect(message.textContent.trim()).toBe('Are you sure you want to proceed?');
  });

  it('should display a custom message when provided', () => {
    component.message = 'Are you sure you want to delete?';
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.modal__message');
    expect(message.textContent.trim()).toBe('Are you sure you want to delete?');
  });

  it('should emit confirmed when the confirm button is clicked', () => {
    const spy = spyOn(component.confirmed, 'emit');

    fixture.nativeElement.querySelector('.modal__btn--confirm').click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled when the cancel button is clicked', () => {
    const spy = spyOn(component.cancelled, 'emit');

    fixture.nativeElement.querySelector('.modal__btn--cancel').click();

    expect(spy).toHaveBeenCalled();
  });
});
