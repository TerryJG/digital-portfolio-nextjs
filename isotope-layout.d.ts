declare module "isotope-layout" {
  export interface IsotopeOptions {
    itemSelector?: string;
    layoutMode?: string;
    masonry?: {
      columnWidth?: string | number | Element;
      gutter?: string | number;
    };
    percentPosition?: boolean;
    hiddenStyle?: {
      opacity?: number;
    };
    visibleStyle?: {
      opacity?: number;
    };
    transitionDuration?: string | number;
  }

  export interface IsotopeArrangeOptions {
    filter?: string;
    transitionDuration?: string | number;
  }

  export default class Isotope {
    constructor(element: Element | string, options?: IsotopeOptions);
    arrange(options?: IsotopeArrangeOptions): void;
    layout(): void;
    reloadItems(): void;
    destroy(): void;
  }
}

declare module "infinite-scroll" {
  export interface InfiniteScrollOptions {
    path?: string | (() => string | null);
    append?: string | Element | NodeList | boolean;
    history?: boolean;
    scrollThreshold?: number | boolean;
    status?: string;
    hideNav?: string;
    checkLastPage?: boolean | string;
  }

  export default class InfiniteScroll {
    constructor(element: Element | string, options?: InfiniteScrollOptions);
    on(event: string, callback: () => void): void;
    off(event: string, callback: () => void): void;
    destroy(): void;
    loadNextPage(): void;
  }
}
