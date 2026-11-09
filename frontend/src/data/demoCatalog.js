// Demo catalog.
//
// Shown when the storefront cannot reach the live backend (the Render
// service is currently suspended). The products below are sample data with
// freely usable Unsplash photos, shaped exactly like the products the API
// returns, so every browse/search/product page works without a backend.
// Cart, accounts, and checkout still need the live API and are not faked.
//
// The fallback is per session: a failed fetch marks the session as demo
// (sessionStorage "demoCatalog"), a successful fetch clears the mark.

const unsplash = (id) => `https://images.unsplash.com/${id}?w=900&q=80`;

const demoSections = [
  {
    _id: "demo-men",
    sectionTitle: "men",
    slug: "men",
    tags: ["men"],
    description: "Men's clothing",
    imageURL: unsplash("photo-1617137968427-85924c800a22"),
  },
  {
    _id: "demo-women",
    sectionTitle: "women",
    slug: "women",
    tags: ["women"],
    description: "Women's clothing",
    imageURL: unsplash("photo-1529139574466-a303027c1d8b"),
  },
  {
    _id: "demo-new",
    sectionTitle: "new arrivals",
    slug: "new",
    tags: ["new"],
    description: "New arrivals",
    imageURL: unsplash("photo-1445205170230-053b83016050"),
  },
];

const demoProducts = [
  {
    sku: "DEMO-1",
    productName: "Everyday Hoodie",
    type: "Men's Clothing",
    price: 68,
    discount: 0,
    description:
      "Heavyweight fleece hoodie with a kangaroo pocket and ribbed cuffs. The everyday layer.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { colorName: "Black", colorCode: "#1a1a1a", idMod: "bla", numImages: 1 },
      { colorName: "Oat", colorCode: "#d9cdbf", idMod: "oat", numImages: 1 },
    ],
    tags: ["men", "hoodies", "new"],
    imageUrls: [unsplash("photo-1556821840-3a63f95609a7")],
  },
  {
    sku: "DEMO-2",
    productName: "Classic White Tee",
    type: "Men's Clothing",
    price: 28,
    discount: 0,
    description:
      "A heavyweight cotton tee with a clean, boxy cut. Cut long enough to tuck, short enough not to.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { colorName: "White", colorCode: "#f4f4f2", idMod: "wht", numImages: 1 },
    ],
    tags: ["men", "new"],
    imageUrls: [unsplash("photo-1521572163474-6864f9cf17ab")],
  },
  {
    sku: "DEMO-3",
    productName: "Leather Jacket",
    type: "Men's Clothing",
    price: 189,
    discount: 15,
    description:
      "Full-grain leather jacket with a snap collar and two-way zip. Breaks in, doesn't break down.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { colorName: "Black", colorCode: "#1a1a1a", idMod: "bla", numImages: 1 },
    ],
    tags: ["men", "jackets"],
    imageUrls: [unsplash("photo-1551028719-00167b16eac5")],
  },
  {
    sku: "DEMO-4",
    productName: "Field Jacket",
    type: "Men's Clothing",
    price: 148,
    discount: 0,
    description:
      "Waxed canvas field jacket with four bellows pockets and a storm collar. Built for bad weather.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { colorName: "Olive", colorCode: "#5b6142", idMod: "olv", numImages: 1 },
    ],
    tags: ["men", "jackets", "new"],
    imageUrls: [unsplash("photo-1591047139829-d91aecb6caea")],
  },
  {
    sku: "DEMO-5",
    productName: "Essential Tee",
    type: "Women's Clothing",
    price: 32,
    discount: 0,
    description:
      "Soft, slub-knit tee with a slightly cropped, straight cut. The one you reach for first.",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { colorName: "White", colorCode: "#f4f4f2", idMod: "wht", numImages: 1 },
    ],
    tags: ["women", "new"],
    imageUrls: [unsplash("photo-1576566588028-4147f3842f27")],
  },
  {
    sku: "DEMO-6",
    productName: "Slip Dress",
    type: "Women's Clothing",
    price: 98,
    discount: 0,
    description:
      "Bias-cut slip dress with adjustable straps. Dress it up, or wear it over a tee.",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { colorName: "Sage", colorCode: "#9caf88", idMod: "sag", numImages: 1 },
    ],
    tags: ["women", "dresses"],
    imageUrls: [unsplash("photo-1595777457583-95e059d581b8")],
  },
  {
    sku: "DEMO-7",
    productName: "Straight-Leg Jeans",
    type: "Women's Clothing",
    price: 88,
    discount: 10,
    description:
      "Rigid denim, straight leg, high rise. No stretch, no sag, just a good pair of jeans.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { colorName: "Indigo", colorCode: "#2c3e6b", idMod: "ind", numImages: 1 },
    ],
    tags: ["women", "denim"],
    imageUrls: [unsplash("photo-1541099649105-f69ad21f3246")],
  },
  {
    sku: "DEMO-8",
    productName: "Relaxed Jeans",
    type: "Men's Clothing",
    price: 92,
    discount: 0,
    description:
      "Relaxed-fit jeans in a mid-wash rigid denim. Room to move, made to last.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { colorName: "Indigo", colorCode: "#2c3e6b", idMod: "ind", numImages: 1 },
    ],
    tags: ["men", "denim", "new"],
    imageUrls: [unsplash("photo-1542272604-787c3835535d")],
  },
];

const DEMO_FLAG = "demoCatalog";

const markDemoCatalog = () => {
  try {
    sessionStorage.setItem(DEMO_FLAG, "1");
  } catch {
    // sessionStorage unavailable (private mode); the catalog still works,
    // only the banner won't show.
  }
};

const clearDemoCatalog = () => {
  try {
    sessionStorage.removeItem(DEMO_FLAG);
  } catch {
    // ignore
  }
};

const isDemoCatalog = () => {
  try {
    return sessionStorage.getItem(DEMO_FLAG) === "1";
  } catch {
    return false;
  }
};

// Products matching any of the given tags (case-insensitive), up to `count`.
// With no tags, returns the first `count` products.
const demoProductsForTags = (tagArray = [], count = 3) => {
  const wanted = (tagArray || []).map((t) => String(t).toLowerCase());
  const matched =
    wanted.length === 0
      ? demoProducts
      : demoProducts.filter((p) =>
          p.tags.some((tag) => wanted.includes(tag.toLowerCase()))
        );
  return matched.slice(0, count);
};

// Search over name, type, and tags.
const demoProductsForSearch = (query = "", count = 8) => {
  const q = String(query).toLowerCase().trim();
  if (!q) return demoProducts.slice(0, count);
  return demoProducts
    .filter((p) =>
      [p.productName, p.type, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
    .slice(0, count);
};

// Look up one demo product by the id in a product URL
// (e.g. "DEMO-1" or "DEMO-1-bla-M").
const findDemoProduct = (sku = "") => {
  const base = String(sku).split("-").slice(0, 2).join("-");
  return demoProducts.find((p) => p.sku === base) || null;
};

// The image URL a component should use for a product. Demo products carry
// explicit imageUrls; live products resolve to the S3 bucket as before.
const productImageUrl = (product, colorIdMod, index = 0) => {
  if (product?.imageUrls?.length) {
    return product.imageUrls[Math.min(index, product.imageUrls.length - 1)];
  }
  return `https://productimagesimaginecollective.s3.us-east-2.amazonaws.com/${
    product.sku + "-" + colorIdMod
  }${index === 0 ? "" : "-" + index}`;
};

export {
  demoSections,
  demoProducts,
  markDemoCatalog,
  clearDemoCatalog,
  isDemoCatalog,
  demoProductsForTags,
  demoProductsForSearch,
  findDemoProduct,
  productImageUrl,
};
