import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiscountState {
  hasSignupDiscount: boolean;
  userInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
  setSignupDiscount: (info: { name: string; email: string; phone: string }) => void;
  clearSignupDiscount: () => void;
}

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set) => ({
      hasSignupDiscount: false,
      userInfo: null,
      setSignupDiscount: (info) => set({ hasSignupDiscount: true, userInfo: info }),
      clearSignupDiscount: () => set({ hasSignupDiscount: false, userInfo: null }),
    }),
    {
      name: 'sample-society-discount',
    }
  )
);
