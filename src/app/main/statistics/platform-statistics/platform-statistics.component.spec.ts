import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformStatisticsComponent } from './platform-statistics.component';

describe('PlatformStatisticsComponent', () => {
  let component: PlatformStatisticsComponent;
  let fixture: ComponentFixture<PlatformStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
