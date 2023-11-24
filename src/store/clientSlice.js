import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { nanoid } from "nanoid";

const initialState = {
  openClientSelector: false,
  selectedClient: null,
  data: [],
  newForm: {
    id: nanoid(),
    image: "",
    name: "",
    email: "",
    billingAddress: "",
    mobileNo: "",
  },
  editedID: null,
  deletedID: null,
};

export const ClientUser = createAsyncThunk(
  'client/ClientUser',
  async (clientregister) => {
    const request = await Axios.post('/api/clients/ClientUser', clientregister);
    const response = await request.data;
    return response
  }
);

export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addNewClient: (state, action) => {
      const newDatas = [...state.data, action.payload];
      state.data = newDatas;
      // localforage.setItem(CLIENTS_KEY, newDatas);

      const reNewForm = {
        id: nanoid(),
        image: "",
        name: "",
        email: "",
        billingAddress: "",
        mobileNo: "",
      };

      state.newForm = { ...reNewForm };
      // localforage.setItem(CLIENT_FORM_KEY, reNewForm);
    },

    updateNewClientForm: (state, action) => {
      state.newForm = { ...action.payload };
      // localforage.setItem(CLIENT_FORM_KEY, { ...state.newForm });
    },

    updateNewClientFormField: (state, action) => {
      state.newForm[action.payload.key] = action.payload.value;
      // localforage.setItem(CLIENT_FORM_KEY, { ...state.newForm });
    },

    setAllClients: (state, action) => {
      state.data = action.payload;
    },

    setDeleteId: (state, action) => {
      state.deletedID = action.payload;
    },

    setEditedId: (state, action) => {
      state.editedID = action.payload;
    },

    onConfirmDeletedClient: (state, action) => {
      const newDatas = state.data.filter(
        (client) => client.id !== state.deletedID
      );
      state.data = newDatas;
      state.deletedID = null;
      // localforage.setItem(CLIENTS_KEY, newDatas);
    },

    onConfirmEditClient: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (client) => client.id === state.editedID
      );
      if (isFindIndex !== -1) {
        state.data[isFindIndex] = { ...action.payload };
      }
      state.editedID = null;
      // localforage.setItem(CLIENTS_KEY, [...state.data]);
    },

    setOpenClientSelector: (state, action) => {
      state.openClientSelector = action.payload;
      if (!action.payload) {
        state.selectedClient = null;
      }
    },

    setClientSelector: (state, action) => {
      const isFindIndex = state.data.findIndex(
        (client) => client.id === action.payload
      );
      if (isFindIndex !== -1) {
        state.selectedClient = state.data[isFindIndex];
      }
    },
  },
});

export const {
  addNewClient,
  updateNewClientForm,
  updateNewClientFormField,
  setAllClients,
  setDeleteId,
  setEditedId,
  onConfirmDeletedClient,
  onConfirmEditClient,
  setOpenClientSelector,
  setClientSelector,
} = clientsSlice.actions;

export const getAllClientsSelector = (state) => state.clients.data;

export const getClientNewForm = (state) => state.clients.newForm;

export const getDeletedClientForm = (state) => state.clients.deletedID;

export const getEditedIdForm = (state) => state.clients.editedID;

export const getIsOpenClientSelector = (state) =>
  state.clients.openClientSelector;

export const getSelectedClient = (state) => state.clients.selectedClient;

export default clientsSlice.reducer;
