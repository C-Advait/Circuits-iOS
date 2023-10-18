import routes from "./routes";

export default shouldShowTabBar = (route) => {
  return [
    // The StackNavigator itself should  be included.
    // On initial load, the route will be ROUTINES, rather
    // than ROUTINES_SCREEN.
    routes.ROUTINES,
    routes.ROUTINES_SCREEN,
    routes.SETTINGS_SCREEN,
    routes.DEBUG_SCREEN,
  ].includes(route);
};
