import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Toast } from './toast';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the message', () => {
    component.message = 'Trade deleted successfully.';
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.toast__message');
    expect(el.textContent.trim()).toBe('Trade deleted successfully.');
  });

  it('should emit dismissed when the close button is clicked', () => {
    fixture.detectChanges();
    const dismissedSpy = spyOn(component.dismissed, 'emit');

    fixture.nativeElement.querySelector('.toast__close').click();

    expect(dismissedSpy).toHaveBeenCalled();
  });

  it('should auto-dismiss after the default duration (4000ms)', fakeAsync(() => {
    const dismissedSpy = spyOn(component.dismissed, 'emit');
    fixture.detectChanges();

    tick(4000);

    expect(dismissedSpy).toHaveBeenCalled();
  }));

  it('should auto-dismiss after a custom duration', fakeAsync(() => {
    component.duration = 2000;
    const dismissedSpy = spyOn(component.dismissed, 'emit');
    fixture.detectChanges();

    tick(1999);
    expect(dismissedSpy).not.toHaveBeenCalled();

    tick(1);
    expect(dismissedSpy).toHaveBeenCalled();
  }));

  it('should not emit dismissed after being destroyed', fakeAsync(() => {
    const dismissedSpy = spyOn(component.dismissed, 'emit');
    fixture.detectChanges();

    fixture.destroy();
    tick(4000);

    expect(dismissedSpy).not.toHaveBeenCalled();
  }));
});
