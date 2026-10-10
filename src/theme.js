export const colors = {
  brand: '#702BDD', // sampled from the Brokoto logo
  brandTint: '#EEE6FC',
  bg: '#FBF6EE',
  ink: '#1D1A16',
  body: '#4A4239',
  muted: '#6B6258',
  card: '#FFFFFF',
  line: '#EFE6D6',
  line2: '#E6DCCB',
  dash: '#CDBFA8',
  chip: '#F4ECDD',
  green: '#2F6B3F',
  greenTint: '#D9E6CF',
  greenInk: '#1F4A2B',
  sand: '#F3D9B8',
  map: '#E9E1D2',
};

// Lighter weights for a cleaner, less chunky look.
export const fonts = {
  display: 'Poppins_600SemiBold',
  displayBold: 'Poppins_600SemiBold',
  body: 'Poppins_400Regular',
  bodyMedium: 'Poppins_500Medium',
  bodyBold: 'Poppins_600SemiBold',
};

export const naira = (n) =>
  '₦' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
