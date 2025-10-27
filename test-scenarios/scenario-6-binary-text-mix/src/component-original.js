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
    console.log('loaded'); // ORIGINAL
  }
}

export default ImageComponent;