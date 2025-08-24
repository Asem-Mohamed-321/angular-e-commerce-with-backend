import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingPromotionsComponent } from './sliding-promotions.component';

describe('SlidingPromotionsComponent', () => {
  let component: SlidingPromotionsComponent;
  let fixture: ComponentFixture<SlidingPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingPromotionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidingPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
