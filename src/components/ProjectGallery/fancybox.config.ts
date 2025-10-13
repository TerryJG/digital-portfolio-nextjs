export const fancyboxConfig = {
  video: {
    Carousel: {
      Panzoom: {
        protected: true,
      },
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
      Thumbs: { type: "classic" as const, showOnStart: true },
      Hash: false,
    },
  },
  image: {
    Carousel: {
      Panzoom: {
        protected: true,
      },
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["thumbs", "close"],
        },
      },
      Thumbs: { type: "classic" as const, showOnStart: true },
      Hash: false,
    },
  },
  programming: {
    Carousel: {
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
      Thumbs: { type: "classic" as const, showOnStart: false },
      Hash: false,
    },
  },
};
