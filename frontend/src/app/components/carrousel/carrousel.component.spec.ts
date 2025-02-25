import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs'; // to simulate an observable

import { CarrouselComponent } from './carrousel.component';
import { TodoService } from 'src/app/services/todo.service'; // your service
import { CarrouselItem } from 'src/app/CarrouselItem.model'; // your model

describe('CarrouselComponent', () => {
  let component: CarrouselComponent;
  let fixture: ComponentFixture<CarrouselComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    // Mock the TodoService
    mockTodoService = jasmine.createSpyObj('TodoService', ['getCarrouselItems']);
    
    // Mock the return value of getCarrouselItems
    mockTodoService.getCarrouselItems.and.returnValue(of([
      { url: 'https://example.com/image1.jpg' },
      { url: 'https://example.com/image2.jpg' }
    ]));

    await TestBed.configureTestingModule({
      declarations: [ CarrouselComponent ],
      providers: [
        { provide: TodoService, useValue: mockTodoService } // Use the mocked service
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch carrousel items on init', () => {
    // Check if the mock service was called
    expect(mockTodoService.getCarrouselItems).toHaveBeenCalled();

    // Verify the data was assigned correctly to the component
    expect(component.images.length).toBeGreaterThan(0);
    expect(component.images[0].url).toBe('https://example.com/image1.jpg');
  });
});
