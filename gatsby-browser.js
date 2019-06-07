exports.shouldUpdateScroll = (params) => {
  const {
    prevRouterProps: { location: { pathname: prevPath } },
    routerProps: { location: { pathname: path } },
  } = params;

  return !/lessons/gi.test(prevPath) || !/lessons/gi.test(path);
};
