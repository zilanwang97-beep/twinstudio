export const PRODUCTS = {
  accessory: [
    { id:"accessory-item", image:"/assets/products/accessory/accessory__CONTROL YOURSELF__magnet.png", name:"CONTROL YOURSELF", tag:"magnet", url:"" },
    { id:"accessory-02", image:"/assets/products/accessory/accessory-02__FRENCHIE LOVER__magnet.png", name:"FRENCHIE LOVER", tag:"magnet", url:"" }
  ],
  art: [
    { id:"art-01-2", image:"/assets/products/art/product-1__HEAVY HEAD__print.png", name:"HEAVY HEAD", tag:"print", url:"" },
    { id:"art-02-2", image:"/assets/products/art/product-2__BLACK HEAVY HEAD__print.png", name:"BLACK HEAVY HEAD", tag:"print", url:"" },
    { id:"art-03-2", image:"/assets/products/art/product-3__PAW-LEASE SHARE__print.png", name:"PAW-LEASE SHARE", tag:"print", url:"" },
    { id:"art-04-2", image:"/assets/products/art/product-4__HIGH LIFE__print.png", name:"HIGH LIFE", tag:"print", url:"" },
    { id:"art-05-2", image:"/assets/products/art/product-5__SHADOW OF ME__print.png", name:"SHADOW OF ME", tag:"print", url:"" },
    { id:"art-06-2", image:"/assets/products/art/product-6__WEIGHT OF LOVE__print.png", name:"WEIGHT OF LOVE", tag:"print", url:"" }
  ],
  home: [
    { id:"home-01-2", image:"/assets/products/home/home-1__NAP TIME__cushion.png", name:"NAP TIME", tag:"cushion", url:"" },
    { id:"home-02-2", image:"/assets/products/home/home-2__RICH FLOWER__cushion.png", name:"RICH FLOWER", tag:"cushion", url:"" },
    { id:"home-03-2", image:"/assets/products/home/home-3__HUG HUG__cushion.png", name:"HUG HUG", tag:"cushion", url:"" },
    { id:"home-04-2", image:"/assets/products/home/home-4__CRAZY DOG__cushion.png", name:"CRAZY DOG", tag:"cushion", url:"" },
    { id:"home-05-2", image:"/assets/products/home/home-5__HEAVY HEAD__cushion.png", name:"HEAVY HEAD", tag:"cushion", url:"" },
    { id:"home-06-2", image:"/assets/products/home/home-6__PINK BEDLINGTON__cushion.png", name:"PINK BEDLINGTON", tag:"cushion", url:"" },
    { id:"home-07-2", image:"/assets/products/home/home-7__PIGGY DOG__rug.png", name:"PIGGY DOG", tag:"rug", url:"" },
    { id:"home-08-2", image:"/assets/products/home/home-8__SLEEPY BEDLINGTON__rug.png", name:"SLEEPY BEDLINGTON", tag:"rug", url:"" }
  ],
  handcraft: [
  ],
  apparel: [
    { id:"apparel-item", image:"/assets/products/apparel/apparel__coming soon__apparel.png", name:"coming soon", tag:"apparel", url:"" }
  ],
  doggoods: [
    { id:"doggoods-item-2", image:"/assets/products/doggoods/doggoods__coming soon__doggoods.png", name:"coming soon", tag:"doggoods", url:"" },
    { id:"doggoods-item", image:"/assets/products/doggoods/doggoods__poop bag__dog goods.png", name:"poop bag", tag:"dog goods", url:"" }
  ]
};
export const CATEGORIES = [
  {
    id: "accessory",
    label: "ACCESSORY",
    slogan: "CARRY\nLITTLE\nMOMENTS,\nTOGETHER.",
    blurb: "Everyday keepers for the little things you carry together — tags, magnets, and pocket-sized reminders.",
    hero: "/assets/shared/heroes/hero-accessory.jpg"
  },
  {
    id: "art",
    label: "ART",
    slogan: "STORIES\nWORTH\nHANGING\nONTO.",
    blurb: "Prints and paper goods that hang the stories you want to keep close.",
    hero: "/assets/shared/heroes/hero-art.jpg"
  },
  {
    id: "home",
    label: "HOME SERIES",
    slogan: "OBJECTS\nTHAT MAKE\nHOME FEEL\nSHARED.",
    blurb: "Soft shapes and familiar forms that make a room feel like it belongs to both of you.",
    hero: "/assets/shared/heroes/hero-home.jpg"
  },
  {
    id: "handcraft",
    label: "HANDCRAFT",
    slogan: "MADE BY\nHAND.\nMEANT TO\nLAST.",
    blurb: "Slow-made companions, finished by hand — small objects meant to stay.",
    hero: "/assets/shared/heroes/hero-handcraft.jpg"
  },
  {
    id: "apparel",
    label: "APPAREL",
    slogan: "WEAR\nTHE LIFE\nYOU\nSHARED.",
    blurb: "Soft pieces with a playful line — wear the life you share.",
    hero: "/assets/shared/heroes/hero-apparel.jpg"
  },
  {
    id: "doggoods",
    label: "PET GOODS",
    slogan: "GOOD FOR\nTHEM.\nTHOUGHTFUL\nFOR YOU.",
    blurb: "Thoughtful picks for them, designed with you in mind.",
    hero: "/assets/shared/heroes/hero-doggoods.jpg"
  }
].map(category => ({ ...category, products: PRODUCTS[category.id] }));
