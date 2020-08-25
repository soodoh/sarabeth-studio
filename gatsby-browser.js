const { transitionDelay } = require('./src/components/Layout/PageTransition');

exports.shouldUpdateScroll = params => {
  const {
    prevRouterProps: {
      location: { pathname: prevPath },
    },
    routerProps: { location },
    getSavedScrollPosition,
  } = params;
  const { pathname: path } = location;

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
