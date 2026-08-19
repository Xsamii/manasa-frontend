import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../testing/test-providers';
import { CreateCustomQuizComponent } from './create-custom-quiz.component';

describe('CreateCustomQuizComponent', () => {
  let component: CreateCustomQuizComponent;
  let fixture: ComponentFixture<CreateCustomQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCustomQuizComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCustomQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
