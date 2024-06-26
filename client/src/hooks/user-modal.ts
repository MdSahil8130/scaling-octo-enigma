import { create } from "zustand";

export type ModalType = "createSubevent"  | "createEvent" | "inviteMember";

interface Modalstore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<Modalstore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => {
    set({ type, isOpen: true });
  },
  onClose: () => {
    set({ type: null, isOpen: false });
  },
}));
