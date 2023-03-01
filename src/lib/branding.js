const BRANDING = {
  projectName: "JUNGLELAB",

  superUserName: "junglelab",

  urls: {
    base: "junglelab.io",
    www: "www.junglelab.io",
    protocol: "https://junglelab.io",
    external: {
      twitter: "https://twitter.com/junglelab_io",
      telegram: "https://t.me/+fal5TBUf5AAyOGRk",
      blog: "https://junglelab.net/",
      facebook: "https://facebook.com/escabaeskyee",
      instagram: "https://instagram.com/junglelab.io",
      discord: "https://discord.gg/eqWEC5rq8A",
    },
  },

  meta: {
    title: "JUNGLELABᵀᴹ",
    keywords: "Bitcoin Liquid Lightning LNFT Event Tickets,Video,Music,Art",
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
      title: `JUNGLELAB - ${art.title}`,
      image: `/api/ipfs/${art.filename}`,
      url: `https://junglelab.io/a/${art.slug}`,
    }),
  },

  emails: {
    support: "support@junglelab.io",
  },
};

export default BRANDING;
