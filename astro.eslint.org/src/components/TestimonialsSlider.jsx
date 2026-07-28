import { useId, useState } from "react";
import { useSwipeable } from "react-swipeable";

export default function TestimonialsSlider({ items }) {
	const sliderId = useId();
	const [currentIndex, setCurrentIndex] = useState(0);
	const lastIndex = items.length - 1;

	const showPreviousSlide = () => {
		setCurrentIndex(index => Math.max(index - 1, 0));
	};

	const showNextSlide = () => {
		setCurrentIndex(index => Math.min(index + 1, lastIndex));
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: showNextSlide,
		onSwipedRight: showPreviousSlide,
		preventScrollOnSwipe: true,
		trackMouse: true,
	});

	return (
		<div
			className="c-slider c-slider--testimonials js-slider"
			role="group"
			aria-roledescription="Slider"
			aria-label="Testimonials"
		>
			<span aria-live="polite" className="visually-hidden c-slider__SRHelper">
				{`Showing slide ${currentIndex + 1} of ${items.length}`}
			</span>
			<div className="c-slider__slides-container" {...swipeHandlers}>
				<div
					className="c-slider__slides-wrapper"
					style={{ transform: `translateX(${currentIndex * -100}%)` }}
				>
					{items.map((item, index) => (
						<div
							className="c-slider__slide focusable"
							id={`${sliderId}-${index}`}
							key={item.name}
							role="group"
							aria-roledescription="Slide"
							data-hidden={index !== currentIndex}
							tabIndex={index === currentIndex ? 0 : -1}
						>
							<blockquote className="c-slider__testimonial span-1-6">
								<div className="c-slider__testimonial__content">
									<p>{item.text}</p>
								</div>
								<footer className="c-slider__testimonial__footer">
									<cite className="profile contributor">
										<img
											className="profile__photo profile__photo--small"
											src={`/assets/images/people/testimonials/small/${item.image}`}
											width="48"
											height="48"
											alt={item.name}
											loading="lazy"
										/>
										<div className="profile__details">
											<span className="c-slider__testimonial__author profile__name">
												{item.name}
											</span>
											<span className="c-slider__testimonial__author-role profile__title">
												{item.title}
											</span>
										</div>
									</cite>
								</footer>
							</blockquote>
							<div className="span-8-12">
								<div className="c-slider__testimonial__img">
									<img
										src={`/assets/images/people/testimonials/large/${item.image}`}
										alt={item.name}
										loading="lazy"
										decoding="async"
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="c-slider__paddleNav">
				<button
					className="c-slider__paddleNav__prev"
					aria-label="Previous Slide"
					aria-disabled={currentIndex === 0}
					tabIndex={currentIndex === 0 ? -1 : undefined}
					onClick={showPreviousSlide}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						aria-hidden="true"
						focusable="false"
					>
						<path
							d="M19 12H5M5 12L12 19M5 12L12 5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
                </button>
                {" "}
				<button
					className="c-slider__paddleNav__next"
					aria-label="Next Slide"
					aria-disabled={currentIndex === lastIndex}
					tabIndex={currentIndex === lastIndex ? -1 : undefined}
					onClick={showNextSlide}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						aria-hidden="true"
						focusable="false"
					>
						<path
							d="M5 12H19M19 12L12 5M19 12L12 19"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
