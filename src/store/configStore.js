import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./clientSlice";
import productRedicer from "./productSlice";
import companyReducer from "./companySlice";
import invoiceReducer from "./invoiceSlice";
import userReducer from "./userSlice";
import otpReducer from "./otpSlice";
import invoicedetailsReducer from "./invoiceSlice";
import userRolesReducer from "./userRoleSlice";
import clientDetailsReducer from "./clientDetailsSlice";
import invoiceListReducer from "./invoiceListSlice";
import invoiceEditReducer from "./invoiceEditSlice";
import invoiceUpdateReducer from "./invoiceUpdateSlice";



export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    company: companyReducer,
    products: productRedicer,
    invoices: invoiceReducer,
    user: userReducer,
    otp: otpReducer,
    invoicedetails: invoicedetailsReducer,
    userrole: userRolesReducer,
    clientDetails: clientDetailsReducer,
    userList: invoiceListReducer,
    editInvoice: invoiceEditReducer,
    updateInvoice: invoiceUpdateReducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
