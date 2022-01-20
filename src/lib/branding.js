const BRANDING = {
  projectName: "JungleLab",

  superUserName: "junglelab",

  urls: {
    base: "junglelab",
    www: "www.junglelab.io",
    protocol: "https://junglelab.io",
    external: {
      twitter: "https://twitter.com/junglelab_io",
      telegram: "https://t.me/raretoshi",
      blog: "https://junglelab.net/",
      facebook: "https://facebook.com/raretoshi",
			instagram: "https://instagram.com/junglelab.io",
			discord: "https://discord.gg/XUxPs3YnQz",
    },
  },

  meta: {
    title: "JungleLab",
    keywords: "Bitcoin Liquid LNFT Video,Music,Art",
    description:
      "Upload, collect, and transact rare digital assets on the Liquid Network",
    image: "https://junglelab.io/splash.png",
    url: "https://junglelab.io/",

    twitter: {
      card: "summary_large_image",
      creator: "@junglelab",
      site: "@junglelab.io",
    },

    artwork: (art) => ({
      title: `JungleLab - ${art.title}`,
      image: `/api/ipfs/${art.filename}`,
      url: `https://junglelab.io/a/${art.slug}`,
    }),
  },

  emails: {
    support: "support@junglelab.io",
  },
};

export default BRANDING;
