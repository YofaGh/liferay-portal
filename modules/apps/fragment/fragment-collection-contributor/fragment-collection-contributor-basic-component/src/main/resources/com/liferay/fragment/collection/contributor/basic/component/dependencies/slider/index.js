const MOVE_LEFT = 'move-left';
const MOVE_RIGHT = 'move-right';
const INTERVAL = 5000;

const editMode = document.body.classList.contains('has-edit-mode-menu');
const indicators = [].slice.call(
	document.querySelectorAll('.carousel-navigation button')
);
const items = [].slice.call(document.querySelectorAll('.carousel-item'));

const next = document.querySelector('.carousel-control-next');
const prev = document.querySelector('.carousel-control-prev');

function getActiveIndicator() {
	return document.querySelector(
		'.carousel-navigation .active'
	);
}

function move(movement, index = null) {
	const activeItem = document.querySelector('.carousel-item.active');
	const indexActiveItem = items.indexOf(activeItem);
	const activeIndicator = getActiveIndicator();

	let nextItemIndex =
		indexActiveItem < 1 ? items.length - 1 : indexActiveItem - 1;

	if (index !== null) {
		nextItemIndex = index;
	}
	else if (movement === MOVE_RIGHT) {
		nextItemIndex = indexActiveItem >= 2 ? 0 : indexActiveItem + 1;
	}

	const nextItem = items[nextItemIndex];

	activeItem.classList.add(movement);
	nextItem.classList.add(movement);
	activeIndicator.classList.remove('active');
	indicators[nextItemIndex].classList.add('active');

	setTimeout(function () {
		activeItem.classList.remove('active', movement);
		nextItem.classList.add('active');
		nextItem.classList.remove(movement);
	}, 600);
}

function createInterval() {
	let intervalId = null;

	if (!editMode) {
		intervalId = setInterval(function () {
			if (document.contains(items[0])) {
				move(MOVE_RIGHT);
			}
			else {
				clearInterval(intervalId);
			}
		}, INTERVAL);
	}

	return intervalId;
}

(function main() {
	let intervalId = createInterval();

	prev.addEventListener('click', function () {
		clearInterval(intervalId);
		intervalId = createInterval();
		move(MOVE_LEFT);
	});

	next.addEventListener('click', function () {
		clearInterval(intervalId);
		intervalId = createInterval();
		move(MOVE_RIGHT);
	});

	indicators.forEach(function (indicator, index) {
		indicator.addEventListener('click', function () {
			const indexActiveIndicator = indicators.indexOf(
				getActiveIndicator()
			);

			if (index !== indexActiveIndicator) {
				if (index < indexActiveIndicator) {
					move(MOVE_LEFT, index);
				}
				else {
					move(MOVE_RIGHT, index);
				}
			}

			clearInterval(intervalId);
			intervalId = createInterval();
		});
	});
}());