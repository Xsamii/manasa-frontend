import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../../testing/test-providers';
import { CenterResultsComponent } from './center-results.component';

describe('CenterResultsComponent', () => {
  let component: CenterResultsComponent;
  let fixture: ComponentFixture<CenterResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterResultsComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
