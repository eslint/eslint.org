const helpers = {
  /**
   * Returns attributes based on whether the link is active or
   * a parent of an active item
   */
  getLinkActiveState(itemUrl: string, pageUrl: string) {
    return {
      "aria-current": itemUrl === pageUrl ? ("page" as const) : undefined,
      "data-current":
        itemUrl.length > 1 && pageUrl.startsWith(itemUrl) ? "true" : undefined,
    };
  },

  setBlogActiveState(itemUrl: string, pageUrl: string) {
    return {
      "aria-current":
        itemUrl === pageUrl || pageUrl.includes("/blog/page/")
          ? ("page" as const)
          : undefined,
    };
  },

  setActiveCategory(itemUrl: string, pageUrl: string) {
    return {
      "aria-current":
        itemUrl === pageUrl ||
        (itemUrl.length > 1 && pageUrl.startsWith(itemUrl))
          ? ("page" as const)
          : undefined,
    };
  },

  excludeThis<T extends { url: string }>(arr: T[], pageUrl: string) {
    return arr.filter((item) => item.url !== pageUrl);
  },

  isDev: import.meta.env.DEV,
};

export default helpers;
