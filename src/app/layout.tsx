import type { Metadata } from "next";
import { Noto_Sans, DM_Serif_Text } from "next/font/google";
import faviconLight from './favicon-light.png';
import faviconDark from './favicon-dark.png';
import "./globals.css"
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import "@/components/ProjectGallery/fancybox.css"

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  weight: "400",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Digital Portfolio - Terrance Gibson",
  description: "Terrance Gibson | Digital Portfolio ",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: faviconLight.src,
        href: faviconLight.src,
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: faviconDark.src,
        href: faviconDark.src,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${dmSerifText.variable} bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}