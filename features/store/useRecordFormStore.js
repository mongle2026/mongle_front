import { create } from 'zustand';

const initialState = {
  recordType: null, // 'post' | 'letter'

  receiver: null,

  music: null,

  text: '',
  files: [],

  visibility: 'PUBLIC',
};

export const useRecordFormStore = create((set) => ({
  ...initialState,

  setRecordType: (recordType) =>
    set((state) => ({
      recordType,
      receiver: recordType === 'post' ? null : state.receiver,
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

  resetForm: () =>
    set({
      ...initialState,
    }),
}));