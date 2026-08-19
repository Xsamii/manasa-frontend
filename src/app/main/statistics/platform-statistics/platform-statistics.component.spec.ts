import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../testing/test-providers';
import { PlatformStatisticsComponent } from './platform-statistics.component';

describe('PlatformStatisticsComponent', () => {
  let component: PlatformStatisticsComponent;
  let fixture: ComponentFixture<PlatformStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformStatisticsComponent],
      providers: testProviders,
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
