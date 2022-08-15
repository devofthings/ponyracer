import { TestBed } from '@angular/core/testing';

import { PonyComponent } from './pony.component';
import { PonyModel } from '../models/pony.model';

describe('PonyComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [PonyComponent]
    })
  );

  it('should have method to get the image URL', () => {
    // given a pony component with a PURPLE pony
    const ponyComponent: PonyComponent = new PonyComponent();
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'PURPLE' };

    // when we call the method for the URL
    const url = ponyComponent.getPonyImageUrl();

    // then we should have a nice URL
    expect(url).withContext('The URL built with `getPonyImageUrl` is not correct').toBe('assets/images/pony-purple.gif');
  });

  it('should display an image and a legend', () => {
    const fixture = TestBed.createComponent(PonyComponent);

    // given a pony component with a PURPLE pony
    const ponyComponent: PonyComponent = fixture.componentInstance;
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'PURPLE' };

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have an image and a legend
    const element = fixture.nativeElement;
    const image = element.querySelector('img');
    expect(image).withContext('You should have an image for the pony').not.toBeNull();
    expect(image.getAttribute('src')).withContext('The `src` attribute of the image is not correct').toBe('assets/images/pony-purple.gif');
    expect(image.getAttribute('alt')).withContext('The `alt` attribute for the image is not correct').toBe('Fast Rainbow');
    const legend = element.querySelector('figcaption');
    expect(legend).withContext('You should have a `figcaption` element for the pony').not.toBeNull();
    expect(legend.textContent).withContext('The `figcaption` element should display the name of the pony').toContain('Fast Rainbow');
  });

  it('should emit an event on click', () => {
    const fixture = TestBed.createComponent(PonyComponent);
    let ponyClickedCalled = false;

    // given a pony component with a PURPLE pony
    const ponyComponent: PonyComponent = fixture.componentInstance;
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'PURPLE' };

    ponyComponent.ponyClicked.subscribe((pony: PonyModel) => {
      expect(pony).withContext('The output should emit the `ponyModel` on a click').toBe(ponyComponent.ponyModel);
      ponyClickedCalled = true;
    });

    // when we click on the element
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const figure = element.querySelector('figure');
    expect(figure).withContext('You should have a `figure` element for the pony').not.toBeNull();
    expect(window.getComputedStyle(figure).getPropertyValue('padding-top'))
      .withContext('You must apply some styles to the `figure` element')
      .toBe('3px');
    figure.dispatchEvent(new Event('click'));
    expect(ponyClickedCalled).withContext('You may have forgot the click handler on the `figure` element').toBeTruthy();
  });

  it('should have method to get the image URL for a running pony', () => {
    // given a pony component with a GREEN running pony
    const ponyComponent: PonyComponent = new PonyComponent();
    ponyComponent.ponyModel = { id: 1, name: 'Fast Rainbow', color: 'GREEN' };
    ponyComponent.isRunning = true;

    // when we call the method for the URL
    const url = ponyComponent.getPonyImageUrl();

    // then we should have a nice URL
    expect(url).toBe('assets/images/pony-green-running.gif');
  });
});
