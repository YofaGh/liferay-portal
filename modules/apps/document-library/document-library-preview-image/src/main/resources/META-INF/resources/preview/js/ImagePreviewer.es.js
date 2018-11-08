import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ImagePreviewer.soy';
import {Config} from 'metal-state';

/**
 * Available zoom sizes
 * @type {Array<number>}
 */
const ZOOM_LEVELS = [
	0.1,
	0.2,
	0.3,
	0.4,
	0.5,
	0.6,
	0.7,
	0.8,
	0.9,
	1
];

/**
 * Available reversed zoom sizes
 * @type {Array<number>}
 */
const ZOOM_LEVELS_REVERSED = ZOOM_LEVELS.slice().reverse();

/**
 * Zoom ratio limit that fire the autocenter
 * @type {number}
 */
const MIN_ZOOM_RATIO_AUTOCENTER = 3;

/**
 * Component that create an image preview to allow zoom
 * @review
 */
class ImagePreviewer extends Component {

	/**
	 * @inheritDoc
	 */
	attached() {
		this._imageNaturalWidth = this.refs.image.naturalWidth;
		this._imageNaturalHeight = this.refs.image.naturalHeight;
		this._isPreviewFit = true;

		this._updateDimensions();

		this._updateDimensionsFn = this._updateDimensions.bind(this);
		window.addEventListener('resize', this._updateDimensionsFn);
	}

	/**
	 * @inheritDoc
	 */
	detached() {
		window.removeEventListener('resize', this._updateDimensionsFn);
	}

	/**
	 * @inheritDoc
	 */
	rendered() {
		if (this._zoomRatio) {
			this._setScrollContainer();
		}

		if (this._reCalculateZoomActual) {
			this._reCalculateZoomActual = false;

			this._calculateZoomActual();
		}
	}

	/**
	 * @inheritDoc
	 */
	syncZoomActual() {
		this.zoomInDisabled = ZOOM_LEVELS_REVERSED[0] === this.zoomActual;
		this.zoomOutDisabled = ZOOM_LEVELS[0] >= this.zoomActual;
	}

	/**
	 * Set the zoom based in multiplier
	 * @param {number} zoomNumber
	 * @private
	 * @review
	 */
	_applyZoom(zoomNumber) {
		this.imageHeight = this._imageNaturalHeight * zoomNumber;
		this.imageWidth = this._imageNaturalWidth * zoomNumber;
		this.zoomActual = zoomNumber;
		this._zoomRatio = zoomNumber / this.zoomActual;
		this._isPreviewFit = false;

		this._updateDimensions();
	}

	/**
	 * Calculate actual zoom based in image rendered
	 * @private
	 * @review
	 */
	_calculateZoomActual() {
		this.zoomActual = this.refs.image.width / this._imageNaturalWidth;
	}

	/**
	 * Clear zoom and allow the image fit the container in natural way
	 * @private
	 * @review
	 */
	_clearZoom() {
		this.imageHeight = null;
		this.imageWidth = null;
		this.imageMargin = null;
		this._isPreviewFit = true;
		this._reCalculateZoomActual = true;
	}

	/**
	 * Event handler executed when zoom changed
	 * @param {!Event} event
	 * @private
	 * @review
	 */
	_handleToolbarClick(event) {
		const value = event.currentTarget.value;

		let zoomValue;

		switch (value) {
		case 'in':
			zoomValue = ZOOM_LEVELS
				.find((zoom) => zoom > this.zoomActual);
			break;
		case 'out':
			zoomValue = ZOOM_LEVELS_REVERSED
				.find((zoom) => zoom < this.zoomActual);
			break;
		case 'real':
			zoomValue = 1;
			break;
		case 'fit':
			this._clearZoom();
			break;
		}

		if (zoomValue) {
			this._applyZoom(zoomValue);
		}
	}

	/**
	 * Move the scroll of the cointainer based in the actual position or center
	 * @private
	 * @review
	 */
	_setScrollContainer() {
		let imageContainer = this.refs.imageContainer;
		let scrollLeft;
		let scrollTop;

		if (this._zoomRatio < MIN_ZOOM_RATIO_AUTOCENTER) {
			scrollLeft = imageContainer.clientWidth * (this._zoomRatio - 1) / 2 + imageContainer.scrollLeft * this._zoomRatio;
			scrollTop = imageContainer.clientHeight * (this._zoomRatio - 1) / 2 + imageContainer.scrollTop * this._zoomRatio;
		}
		else {
			scrollTop = (this.imageHeight - imageContainer.clientHeight) / 2;
			scrollLeft = (this.imageWidth - imageContainer.clientWidth) / 2;
		}

		imageContainer.scrollLeft = scrollLeft;
		imageContainer.scrollTop = scrollTop;

		this._zoomRatio = null;
	}

	/**
	 * Calculate actual dimensions based in container rendered
	 * @private
	 * @review
	 */
	_updateDimensions() {
		this.imageMargin = `${
			this.imageHeight > this.refs.imageContainer.clientHeight ? 0 : 'auto'
		} ${
			this.imageWidth > this.refs.imageContainer.clientWidth ? 0 : 'auto'
		}`;

		if (this._isPreviewFit) {
			this._calculateZoomActual();
		}
	}
}

/**
 * State definition.
 * @review
 * @static
 * @type {!Object}
 */

ImagePreviewer.STATE = {

	/**
	 * The height of the <img> element.
	 * @type {Number}
	 */
	imageHeight: Config.number(),

	/**
	 * The margin of the <img> element
	 * @type {String}
	 */
	imageMargin: Config.string(),

	/**
	 * The "src" attribute of the <img> element
	 * @type {String}
	 */
	imageURL: Config.string().required(),

	/**
	 * The width of the <img> element.
	 * @type {Number}
	 */
	imageWidth: Config.number(),

	/**
	 * Path to icon images.
	 * @type {String}
	 */
	spritemap: Config.string().required(),

	/**
	 * The current zoom value that is shown in the toolbar.
	 * @type {Number}
	 */
	zoomActual: Config.number(),

	/**
	 * Flag that indicate if 'zoom in' is disabled.
	 * @type {Boolean}
	 */
	zoomInDisabled: Config.bool(),

	/**
	 * Flag that indicate if 'zoom out' is disabled.
	 * @type {Boolean}
	 */
	zoomOutDisabled: Config.bool()
};

Soy.register(ImagePreviewer, templates);

export {ImagePreviewer};
export default ImagePreviewer;