import { IonicModule } from '@ionic/angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ConfigureDevicePage } from './configure-device.page';

describe('ConfigureDevicePage', () => {
  let component: ConfigureDevicePage;
  let fixture: ComponentFixture<ConfigureDevicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureDevicePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDevicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
