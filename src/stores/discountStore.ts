import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiscountState {
  hasSignupDiscount: boolean;
  userInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
  usedEmails: string[];
  usedPhones: string[];
  setSignupDiscount: (info: { name: string; email: string; phone: string }) => void;
  clearSignupDiscount: () => void;
  isEmailUsed: (email: string) => boolean;
  isPhoneUsed: (phone: string) => boolean;
}

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set, get) => ({
      hasSignupDiscount: false,
      userInfo: null,
      usedEmails: [],
      usedPhones: [],
      setSignupDiscount: (info) => set((state) => ({ 
        hasSignupDiscount: true, 
        userInfo: info,
        usedEmails: [...state.usedEmails, info.email.toLowerCase()],
        usedPhones: [...state.usedPhones, info.phone.replace(/\D/g, '')],
      })),
      clearSignupDiscount: () => set({ hasSignupDiscount: false, userInfo: null }),
      isEmailUsed: (email: string) => get().usedEmails.includes(email.toLowerCase()),
      isPhoneUsed: (phone: string) => get().usedPhones.includes(phone.replace(/\D/g, '')),
    }),
    {
      name: 'sample-society-discount',
    }
  )
);
