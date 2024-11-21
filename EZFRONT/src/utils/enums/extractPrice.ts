// utils/extractPrice.ts

export const extractPrice = (priceString: string): number => {
    const match = priceString.match(/([\d,.]+)/);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }
    return 0;
  };
  