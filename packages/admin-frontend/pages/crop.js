import { render } from "react-dom";

import React, { Component } from "react";
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

// const params = new URLSearchParams(window.location.search);
const imageUrl = 'https://images.test.digitallibrary.io/8ee691b7885ce7186f35fe668e08ba60.jpg'; // TODO params.get("imageUrl");
class Crop extends Component {
    state = { ratio: 2.63 };
  
    toPercentages = c => {
      var cropStartPxX = c.getCropBoxData().left - c.getCanvasData().left;
      var cropEndPxX = cropStartPxX + c.getCropBoxData().width;
      var cropStartPxY = c.getCropBoxData().top - c.getCanvasData().top;
      var cropEndPxY = cropStartPxY + c.getCropBoxData().height;
  
      return {
        cropStartX: Math.max(
          0,
          Math.round(cropStartPxX / c.getImageData().naturalWidth * 100)
        ),
        cropEndX: Math.min(
          100,
          Math.round(cropEndPxX / c.getImageData().naturalWidth * 100)
        ),
        cropStartY: Math.max(
          0,
          Math.round(cropStartPxY / c.getImageData().naturalHeight * 100)
        ),
  
        cropEndY: Math.min(
          100,
          Math.round(cropEndPxY / c.getImageData().naturalHeight * 100)
        )
      };
    };
  
    toImageApiBody = pcnt => {
      return {
        forRatio: String(this.state.ratio),
        imageUrl: imageUrl.substr(imageUrl.lastIndexOf("/")),
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
      var url = `${imageUrl}?cropStartX=${pcnt.cropStartX}&cropEndX=${
        pcnt.cropEndX
      }&cropStartY=${pcnt.cropStartY}&cropEndY=${pcnt.cropEndY}`;
  
      var anchor = document.getElementById("image-api-url");
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
            src={imageUrl}
            aspectRatio={this.state.ratio}
            guides={false}
            viewMode={2}
            zoomable={false}
            dragMode={"move"}
            preview={".preview"}
            crop={this._crop.bind(this)}
          />
          <p
            className="preview"
            style={{ overflow: "hidden", height: 400, width: 400 }}
          />
        </div>
      );
    }
  }

  export default Crop;