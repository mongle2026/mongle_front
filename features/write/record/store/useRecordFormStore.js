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

  restoreFile: (file, index) =>
    set(state => {
      const alreadyExists = state.files.some(item => item.uri === file.uri);

      if (alreadyExists) {
        return state;
      }

      const nextFiles = [...state.files];
      const safeIndex = Math.min(Math.max(index, 0), nextFiles.length);

      nextFiles.splice(safeIndex, 0, file);

      return {
        files: nextFiles,
      };
    }),

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