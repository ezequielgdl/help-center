import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function nativeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('defaults to the primary, enabled, non-loading state', () => {
    fixture.detectChanges();
    const btn = nativeButton();
    expect(btn.disabled).toBe(false);
    expect(btn.classList.contains('btn--secondary')).toBe(false);
    expect(btn.getAttribute('aria-busy')).toBeNull();
  });

  it('disables the native button when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeButton().disabled).toBe(true);
  });

  it('disables the native button and sets aria-busy when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const btn = nativeButton();
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('applies the secondary variant class', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    expect(nativeButton().classList.contains('btn--secondary')).toBe(true);
  });
});
