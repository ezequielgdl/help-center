import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

describe('Spinner', () => {
  let component: Spinner;
  let fixture: ComponentFixture<Spinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner],
    }).compileComponents();

    fixture = TestBed.createComponent(Spinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function nativeSpan(): HTMLElement {
    return fixture.nativeElement.querySelector('.spinner');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to md size with no size modifier class and a status role', () => {
    fixture.detectChanges();
    const el = nativeSpan();
    expect(el.classList.contains('spinner--sm')).toBe(false);
    expect(el.classList.contains('spinner--lg')).toBe(false);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('applies the sm/lg size modifier class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(nativeSpan().classList.contains('spinner--sm')).toBe(true);

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(nativeSpan().classList.contains('spinner--lg')).toBe(true);
  });

  it('reflects a custom label as aria-label', () => {
    fixture.componentRef.setInput('label', 'Fetching results');
    fixture.detectChanges();
    expect(nativeSpan().getAttribute('aria-label')).toBe('Fetching results');
  });
});
