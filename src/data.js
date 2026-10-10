// Sample content for the demo. Swap for a real API later.
export const CATEGORIES = ['All', 'Rice', 'Grill', 'Soups', 'Drinks'];

// Unsplash photos (free to use under the Unsplash licence). See README for credits.
export const unsplash = (id, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;

const PHOTO = {
  jollof: 'photo-1664992960082-0ea299a9c53e',
  suya: 'photo-1767974968707-db3d448d4ef3',
  egusi: 'photo-1763048443535-1243379234e2',
  zobo: 'photo-1593624191635-f1a49f5eca76',
};

export const DISHES = {
  jollof: {
    id: 'jollof',
    restaurant: 'Smoke & Spice Grill',
    name: 'Smoky Party Jollof with Grilled Chicken',
    short: 'Smoky Party Jollof',
    sub: 'with grilled chicken',
    price: 4500,
    description:
      'Long-grain rice cooked low in a tomato and pepper base, finished with a smoky bottom pot. Served with a charcoal-grilled chicken quarter and fried plantain.',
    tint: '#F3D9B8',
    image: PHOTO.jollof,
  },
  suya: {
    id: 'suya',
    restaurant: 'Smoke & Spice Grill',
    name: 'Suya Wrap',
    short: 'Suya Wrap',
    sub: 'with onions and yaji',
    price: 3200,
    description:
      'Thin-sliced suya with onions, tomato and yaji spice, rolled in a warm flatbread.',
    tint: '#D9E6CF',
    image: PHOTO.suya,
  },
  egusi: {
    id: 'egusi',
    restaurant: 'Mama Eko Kitchen',
    name: 'Pounded Yam & Egusi',
    short: 'Pounded Yam & Egusi',
    sub: 'with assorted meat',
    price: 5200,
    description:
      'Smooth pounded yam with a rich melon seed soup, stewed greens and assorted meat.',
    tint: '#D9E6CF',
    image: PHOTO.egusi,
  },
  zobo: {
    id: 'zobo',
    restaurant: 'Zobo & Co',
    name: 'Chilled Zobo',
    short: 'Chilled Zobo',
    sub: 'hibiscus, ginger and pineapple',
    price: 1500,
    description:
      'Hibiscus steeped with ginger and pineapple, served over ice. Lightly sweet and tart.',
    tint: '#EEE6FC',
    image: PHOTO.zobo,
  },
};

export const PLACES = [
  {
    id: 'smoke',
    name: 'Smoke & Spice Grill',
    kind: 'Suya, grilled chicken, wraps',
    time: '25–35 min',
    cats: ['Grill', 'Rice'],
    dishId: 'suya',
    tint: '#F3D9B8',
  },
  {
    id: 'eko',
    name: 'Mama Eko Kitchen',
    kind: 'Soups, swallow, rice dishes',
    time: '30–40 min',
    cats: ['Soups', 'Rice'],
    dishId: 'egusi',
    tint: '#D9E6CF',
  },
  {
    id: 'zobo',
    name: 'Zobo & Co',
    kind: 'Chilled drinks and smoothies',
    time: '15–25 min',
    cats: ['Drinks'],
    dishId: 'zobo',
    tint: '#EEE6FC',
  },
];

export const SPICES = ['Mild', 'Medium', 'Hot'];
