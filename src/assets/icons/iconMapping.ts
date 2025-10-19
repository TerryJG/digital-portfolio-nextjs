import { featuredIcons } from "@/assets";

export const icons: Record<
  string,
  {
    src: { src: string };
    displayName: string;
    aliases?: string[];
  }
> = {
  "powerpoint": {
    src: featuredIcons.powerpoint,
    displayName: "Microsoft PowerPoint",
  },
  "figma": {
    src: featuredIcons.figma,
    displayName: "Figma",
  },
  "adobe-photoshop": {
    src: featuredIcons.adobePhotoshop,
    displayName: "Adobe Photoshop",
  },
  "sony-vegas-pro": {
    src: featuredIcons.sonyVegasPro,
    displayName: "Sony Vegas Pro",
  },
  "hitfilm-express": {
    src: featuredIcons.hitfilmExpress,
    displayName: "HitFilm Express",
  },
  "adobe-premiere-pro": {
    src: featuredIcons.adobePremiere,
    displayName: "Adobe Premiere Pro",
    aliases: ["adobe-premiere"],
  },
  "adobe-after-effects": {
    src: featuredIcons.adobeAfterEffects,
    displayName: "Adobe After Effects",
  },
  "davinci-resolve": {
    src: featuredIcons.davinciResolve,
    displayName: "DaVinci Resolve",
  },
  "windows": {
    src: featuredIcons.windows,
    displayName: "Windows",
  },
  "linux": {
    src: featuredIcons.linux,
    displayName: "Linux",
  },
  "wix": {
    src: featuredIcons.wixDark,
    displayName: "Wix",
  },
  "react": {
    src: featuredIcons.react,
    displayName: "React",
  },
  "svelte": {
    src: featuredIcons.svelte,
    displayName: "Svelte",
  },
  "nextjs": {
    src: featuredIcons.nextjsDark,
    displayName: "Next.js",
  },
  "html": {
    src: featuredIcons.htmlDark,
    displayName: "HTML",
  },
  "css": {
    src: featuredIcons.cssDark,
    displayName: "CSS",
  },
  "javascript": {
    src: featuredIcons.javascript,
    displayName: "JavaScript",
  },
  "python": {
    src: featuredIcons.python,
    displayName: "Python",
  },
  "cpp": {
    src: featuredIcons.cpp,
    displayName: "C++",
  },
};

export const getIconSrc = (iconName: string): string => {
  // Check direct match first
  if (icons[iconName]) {
    return icons[iconName].src?.src || "";
  }

  // Check aliases
  for (const config of Object.values(icons)) {
    if (config.aliases?.includes(iconName)) {
      return config.src?.src || "";
    }
  }

  return "";
};
