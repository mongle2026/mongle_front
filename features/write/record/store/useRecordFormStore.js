import { create } from 'zustand';

const initialState = {
  recordType: null, // 'FEED' | 'LETTER'
  receiver: null,
  music: null,
  text: '',
  files: [],
  visibility: 'PUBLIC',
  pattern: null,
  color: null,
  stamp: null,
  deliveryAt: null,
};

export const useRecordFormStore = create((set) => ({
  ...initialState,

  setRecordType: (recordType) =>
    set((state) => ({
      recordType,
      receiver: recordType === 'FEED' ? null : state.receiver,
    })),

  setReceiver: (receiver) =>
    set({
      receiver,
    }),

  setMusic: (music) =>
    set({
      music,
    }),

  setText: (text) =>
    set({
      text,
    }),

  setFiles: (files) =>
    set({
      files,
    }),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  removeFile: (uri) =>
    set((state) => ({
      files: state.files.filter((file) => file.uri !== uri),
    })),

  setVisibility: (visibility) =>
    set({
      visibility,
    }),

  setPattern: (pattern) =>
    set({
      pattern,
    }),

  setColor: (color) =>
    set({
      color,
    }),

  setStamp: (stamp) =>
    set({
      stamp,
    }),

  setDeliveryAt: (deliveryAt) =>
    set({
      deliveryAt,
    }),

  resetForm: () =>
    set({
      ...initialState,
    }),
}));