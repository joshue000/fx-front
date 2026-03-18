import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorModal } from './error-modal';

describe('ErrorModal', () => {
  let component: ErrorModal;
  let fixture: ComponentFixture<ErrorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default message when no input is provided', () => {
    const message = fixture.nativeElement.querySelector('.modal__message');
    expect(message.textContent.trim()).toBe('An unexpected error occurred.');
  });

  it('should display the provided message', () => {
    component.message = 'Trade not found.';
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.modal__message');
    expect(message.textContent.trim()).toBe('Trade not found.');
  });

  it('should emit dismissed when the close button is clicked', () => {
    const emitSpy = spyOn(component.dismissed, 'emit');

    fixture.nativeElement.querySelector('.modal__btn--dismiss').click();

    expect(emitSpy).toHaveBeenCalledOnceWith();
  });

  it('should render the error icon', () => {
    const icon = fixture.nativeElement.querySelector('.fa-circle-exclamation');
    expect(icon).not.toBeNull();
  });
});
