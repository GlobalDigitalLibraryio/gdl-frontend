import { render } from 'react-dom';

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Link from 'next/link';

class Crop extends Component {
  state = { ratio: 0.81 };

  toPercentages = c => {
    var cropStartPxX = c.getCropBoxData().left - c.getCanvasData().left;
    var cropEndPxX = cropStartPxX + c.getCropBoxData().width;
    var cropStartPxY = c.getCropBoxData().top - c.getCanvasData().top;
    var cropEndPxY = cropStartPxY + c.getCropBoxData().height;

    return {
      cropStartX: Math.max(
        0,
        Math.round((cropStartPxX / c.getImageData().naturalWidth) * 100)
      ),
      cropEndX: Math.min(
        100,
        Math.round((cropEndPxX / c.getImageData().naturalWidth) * 100)
      ),
      cropStartY: Math.max(
        0,
        Math.round((cropStartPxY / c.getImageData().naturalHeight) * 100)
      ),

      cropEndY: Math.min(
        100,
        Math.round((cropEndPxY / c.getImageData().naturalHeight) * 100)
      )
    };
  };

  toImageApiBody = pcnt => {
    return {
      forRatio: String(this.state.ratio),
      imageUrl: this.props.imageUrl.substr(
        this.props.imageUrl.lastIndexOf('/')
      ),
      rawImageQueryParameters: {
        cropStartX: pcnt.cropStartX,
        cropEndX: pcnt.cropEndX,
        cropStartY: pcnt.cropStartY,
        cropEndY: pcnt.cropEndY
      }
    };
  };

  _crop() {
    var pcnt = this.toPercentages(this.refs.cropper);
    var url = `${this.props.imageUrl}?cropStartX=${pcnt.cropStartX}&cropEndX=${
      pcnt.cropEndX
    }&cropStartY=${pcnt.cropStartY}&cropEndY=${pcnt.cropEndY}`;

    var anchor = document.getElementById('image-api-url');
    anchor.href = url;
    anchor.text = url;
    console.log(JSON.stringify(this.toImageApiBody(pcnt), undefined, 2));
  }

  toggleRatio = e => {
    e.preventDefault();
    if (this.state.ratio === 0.81) {
      this.setState({ ratio: 2.63 });
    } else {
      this.setState({ ratio: 0.81 });
    }
  };

  render() {
    return (
      <div>
        <p>
          <button onClick={this.toggleRatio}>Toggle ratio</button>
        </p>
        <Cropper
          ref="cropper"
          src={this.props.imageUrl}
          aspectRatio={this.state.ratio}
          guides={false}
          viewMode={2}
          zoomable={false}
          dragMode={'move'}
          preview={'.preview'}
          crop={this._crop.bind(this)}
        />
        <p
          className="preview"
          style={{ overflow: 'hidden', height: 400, width: 400 }}
        />
        <a id="image-api-url">(Link to image-api will be here)</a>
      </div>
    );
  }
}

export default ({
  url: {
    query: { imageUrl }
  }
}) => (
  <div>
    <h1>Crop</h1>
    {imageUrl === undefined ? (
      <p>
        You need to specify <tt>imageUrl</tt> in the URL
      </p>
    ) : (
      <Crop imageUrl={imageUrl} />
    )}
  </div>
);
