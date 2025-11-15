export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  required: (value: string | number | undefined | null): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  },

  min: (value: number, min: number): boolean => {
    return value >= min;
  },

  max: (value: number, max: number): boolean => {
    return value <= max;
  },

  url: (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  dateNotPast: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  },
};

