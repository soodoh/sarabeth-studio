const { transitionDelay } = require('./src/components/Layout/PageTransition');

exports.shouldUpdateScroll = params => {
  const prevPath = params?.prevRouterProps?.location?.pathname;
  const path = params?.routerProps?.location?.pathname;
  const { getSavedScrollPosition } = params;

  // Lessons pages should never change scroll
  const isLessons = !/lessons/gi.test(prevPath) || !/lessons/gi.test(path);
  if (!isLessons) return false;

  // Otherwise delay window scroll to account for Page Transition
  if (location.action === 'PUSH') {
    window.setTimeout(() => window.scrollTo(0, 0), transitionDelay);
  } else {
    const savedPosition = getSavedScrollPosition(location);
    window.setTimeout(() => window.scrollTo(...(savedPosition || [0, 0])), transitionDelay);
  }
  return false;
};
