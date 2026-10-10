// A language switch loads the page again: the proxy reads the new cookie and
// serves the other prerendered copy. Same address, so Next's client router
// would see one URL answer with two different pages, which it treats as an
// error and recovers from with a full reload anyway. So the switch is a page
// load from the start, and the browser cross-fades it (`@view-transition` in
// globals.css). The picker leaves the scroll position under this key.
export const SWITCH_KEY = "locale-switch";

// Inlined in <head>, so it runs before the page's own scripts and before it
// first renders. After a switch it marks <html> (the picker plays its flag),
// keeps the reader where they were and skips the page's entrance animations,
// so only the cross-fade shows. Any other page load, a back or forward
// included, gets no cross-fade.
export const revealScript = `(() => {
  let y = null;
  try {
    y = sessionStorage.getItem("${SWITCH_KEY}");
    sessionStorage.removeItem("${SWITCH_KEY}");
  } catch {}
  if (y !== null) document.documentElement.setAttribute("data-locale-switched", "");
  addEventListener("pagereveal", (event) => {
    if (y === null) return event.viewTransition?.skipTransition();
    const top = Number(y);
    y = null;
    const settle = () => {
      scrollTo(0, top);
      for (const animation of document.getAnimations()) {
        if (animation.effect?.getComputedTiming().endTime !== Infinity) animation.finish();
      }
    };
    settle();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", settle, { once: true });
    }
  });
})();`;
