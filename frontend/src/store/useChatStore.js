import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      console.log(
        "Error in getUsers useChatStore:",
        err?.response?.data?.message || err.error
      );
      toast.error("Fetching users failed, please try again later");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      console.log(
        "Error in getMessages useChatStore:",
        err?.response?.data?.message || err.error
      );
      toast.error("Fetching messages failed, please try again later");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //   todo: optimize later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
