export const PRODUCTS = {
  art: [
    { id:"art-01", image:"/assets/products/art/product-1.png", name:"PRODUCT NAME", tag:"print", url:"" },
    { id:"art-02", image:"/assets/products/art/product-2.png", name:"PRODUCT NAME", tag:"print", url:"" },
    { id:"art-03", image:"/assets/products/art/product-3.png", name:"PRODUCT NAME", tag:"print", url:"" },
    { id:"art-04", image:"/assets/products/art/product-4.png", name:"PRODUCT NAME", tag:"print", url:"" },
    { id:"art-05", image:"/assets/products/art/product-5.png", name:"PRODUCT NAME", tag:"print", url:"" },
    { id:"art-06", image:"/assets/products/art/product-6.png", name:"PRODUCT NAME", tag:"print", url:"" }
  ],
  home: [
    { id:"home-01", image:"/assets/products/home/home-1.png", name:"SLEEPY FRENCHIE", tag:"cushion", url:"" },
    { id:"home-02", image:"/assets/products/home/home-2.png", name:"RICH FLOWER", tag:"cushion", url:"" },
    { id:"home-03", image:"/assets/products/home/home-3.png", name:"HUG HUG", tag:"cushion", url:"" },
    { id:"home-04", image:"/assets/products/home/home-4.png", name:"CRAZY DOG", tag:"cushion", url:"" },
    { id:"home-05", image:"/assets/products/home/home-5.png", name:"HEAVY HEAD", tag:"cushion", url:"" },
    { id:"home-06", image:"/assets/products/home/home-6.png", name:"PINK BEDLINGTON", tag:"cushion", url:"" },
    { id:"home-07", image:"/assets/products/home/home-7.png", name:"PRODUCT NAME", tag:"cushion", url:"" },
    { id:"home-08", image:"/assets/products/home/home-8.png", name:"PRODUCT NAME", tag:"cushion", url:"" }
  ],
  accessory: [
    { id:"accessory-01", image:"/assets/products/accessory/accessory-control-yourself.png", name:"CONTROL YOURSELF", tag:"magnet", url:"" }
  ],
  handcraft: [],
  apparel: [],
  doggoods: []
};

export const CATEGORIES = [
  {
    id: "accessory",
    label: "ACCESSORY",
    slogan: "CARRY\nLITTLE\nMOMENTS,\nTOGETHER.",
    blurb: "Everyday keepers for the little things you carry together — tags, magnets, and pocket-sized reminders.",
    hero: "/assets/mobile/hero-accessory.jpg"
  },
  {
    id: "art",
    label: "ART",
    slogan: "STORIES\nWORTH\nHANGING\nONTO.",
    blurb: "Prints and paper goods that hang the stories you want to keep close.",
    hero: "/assets/mobile/hero-art.jpg"
  },
  {
    id: "home",
    label: "HOME SERIES",
    slogan: "OBJECTS\nTHAT MAKE\nHOME FEEL\nSHARED.",
    blurb: "Soft shapes and familiar forms that make a room feel like it belongs to both of you.",
    hero: "/assets/mobile/hero-home.jpg"
  },
  {
    id: "handcraft",
    label: "HANDCRAFT",
    slogan: "MADE BY\nHAND.\nMEANT TO\nLAST.",
    blurb: "Slow-made companions, finished by hand — small objects meant to stay.",
    hero: "/assets/mobile/hero-handcraft.jpg"
  },
  {
    id: "apparel",
    label: "APPAREL",
    slogan: "WEAR\nTHE LIFE\nYOU\nSHARED.",
    blurb: "Soft pieces with a playful line — wear the life you share.",
    hero: "/assets/mobile/hero-apparel.jpg"
  },
  {
    id: "doggoods",
    label: "PET GOODS",
    slogan: "GOOD FOR\nTHEM.\nTHOUGHTFUL\nFOR YOU.",
    blurb: "Thoughtful picks for them, designed with you in mind.",
    hero: "/assets/mobile/hero-doggoods.jpg"
  }
].map(category => ({ ...category, products: PRODUCTS[category.id] }));
