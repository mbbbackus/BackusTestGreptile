import icon from '../assets/icon.jpg';

class ImageComponent {
  constructor() {
    this.loaded = false;
  }

  render() {
    return `<img src="${icon}" class="component-image" />`;
  }

  onLoad() {
    this.loaded = true;
    console.log('Image loaded successfully'); // CHANGED: was just console.log('loaded')
  }
}

export default ImageComponent;