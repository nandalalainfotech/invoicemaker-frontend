import domtoimage from "dom-to-image";
import { nanoid } from "nanoid";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Button from "../../components/Button/Button";
import PageTitle from "../../components/Common/PageTitle";
import ClientPlusIcon from "../../components/Icons/ClientPlusIcon";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import DollarIcon from "../../components/Icons/DollarIcon";
import InvoiceIcon from "../../components/Icons/InvoiceIcon";
import PlusCircleIcon from "../../components/Icons/PlusCircleIcon";
import SecurityIcon from "../../components/Icons/SecurityIcon";
import TaxesIcon from "../../components/Icons/TaxesIcon";
import InvoiceTopBar from "../../components/Invoice/InvoiceTopBar";
import { IconStyle, defaultInputSmStyle } from "../../constants/defaultStyles";
import { useAppContext } from "../../context/AppContext";
import {
  getSelectedClient,
  setOpenClientSelector,
} from "../../store/clientSlice";
import { getCompanyData } from "../../store/companySlice";
import {
  // Invoicedetails,
  getAllInvoiceDetailSelector,
  getCurrentBGImage,
  getCurrentColor,
  getInvoiceNewForm,
  getIsConfirm,
  setConfirmModalOpen,
  setDefaultBackground,
  setDefaultColor,
  setIsConfirm,
  setNewInvoices,
  setSettingModalOpen,
  updateExisitingInvoiceForm,
  updateNewInvoiceForm,
} from "../../store/invoiceSlice";
import {
  getSelectedProduct,
  setOpenProductSelector,
} from "../../store/productSlice";
import {
  getTotalTaxesWithPercent,
  sumProductTotal,
  sumTotalAmount,
  sumTotalTaxes,
} from "../../utils/match";
import CheckCircleIcon from "../../components/Icons/CheckCircleIcon";
import { useFieldArray, useForm } from "react-hook-form";

function HomeScreen(props) {
  const { handleSubmit, register, reset, control, getValues } = useForm({
    defaultValues: {
      test: [{ Desc: "", qty: "", Rating: "", Amount: "" }],
    },
    mode: "onChange",
  });
  const { initLoading, showNavbar, toggleNavbar, setEscapeOverflow } =
    useAppContext();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const componentRef = useRef(null);
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Invoice Letter",
    onAfterPrint: useCallback(() => {
      setIsExporting(false);
      setEscapeOverflow(false);
    }, [setEscapeOverflow]),
    removeAfterPrint: true,
  });

  const invoiceNewForm = useSelector(getInvoiceNewForm);
  const allInvoiceDetails = useSelector(getAllInvoiceDetailSelector);
  const company = useSelector(getCompanyData);
  const selectedClient = useSelector(getSelectedClient);
  const selectedProduct = useSelector(getSelectedProduct);
  const currentBg = useSelector(getCurrentBGImage);
  const currentColor = useSelector(getCurrentColor);
  const isConfirm = useSelector(getIsConfirm);
  const [invoiceForm, setInvoiceForm] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [creationDate, setCreationDate] = useState();
  const [dueDate, setDueDate] = useState();
  const [tax, setTax] = useState();
  const [subTotals, setSubTotals] = useState();
  const [total, setTotal] = useState();
  const [discount, setDiscount] = useState();
  const [shipping, setShipping] = useState();
  const [balanceDue, setBalanceDue] = useState();
  const [balance, setBalance] = useState();
  const [amount, setAmount] = useState();
  const [statusData, setStatusData] = useState({
    statusName: "Draft",
    statusIndex: 1,
  });

  const handleExport = useCallback(() => {
    if (showNavbar) {
      toggleNavbar();
    }
    if (userDetail) {
      setEscapeOverflow(true);
      setIsViewMode(true);
      setIsExporting(true);
      setTimeout(() => {
        handlePrint();
      }, 3000);
    } else {
      dispatch(setConfirmModalOpen(true));
    }
  }, [handlePrint, setEscapeOverflow, showNavbar, toggleNavbar]);

  const handleDownloadImg = useCallback(() => {
    if (showNavbar) {
      toggleNavbar();
    }
    if (userDetail) {
      setEscapeOverflow(true);
      setIsViewMode(true);
      setIsExporting(true);
      domtoimage
        .toJpeg(componentRef.current, { quality: 1 })
        .then(async (dataUrl) => {
          try {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "invoice.jpeg";
            a.hidden = true;
            document.body.appendChild(a);
            a.click();
            a.remove();
          } catch (e) {
          } finally {
            setIsExporting(false);
            setEscapeOverflow(false);
          }
        });
    } else {
      dispatch(setConfirmModalOpen(true));
    }
  }, [setEscapeOverflow, showNavbar, toggleNavbar]);

  const toggleViewMode = useCallback(() => {
    if (invoiceForm.statusIndex !== "1" && isViewMode) {
      toast.warn("You can only edit on Draft Mode", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    setIsViewMode((prev) => !prev);
  }, [invoiceForm, isViewMode]);

  const openSettingModal = useCallback(() => {
    if (invoiceForm.statusIndex !== "1" && isViewMode) {
      toast.warn("You can only change Setting on Draft Mode", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(setSettingModalOpen(true));
  }, [dispatch, invoiceForm, isViewMode]);

  const openChooseClient = useCallback(() => {
    dispatch(setOpenClientSelector(true));
  }, [dispatch]);

  const openChooseProduct = useCallback(() => {
    dispatch(setOpenProductSelector(true));
  }, [dispatch]);

  const addEmptyProduct = useCallback(() => {
    const emptyProduct = {
      id: nanoid(),
      name: "",
      productID: "",
      amount: 1,
      quantity: 1,
    };

    setInvoiceForm((prev) => {
      let updatedData = { ...prev };
      const updateProducts = [...prev?.products, emptyProduct];
      const subTotalAmount = sumProductTotal(updateProducts);
      const updateTaxes = getTotalTaxesWithPercent(prev.taxes, subTotalAmount);
      updatedData.products = updateProducts;
      updatedData.taxes = updateTaxes;
      updatedData.totalAmount = sumTotalAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return updatedData;
    });
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  // const watchTest = useWatch({
  //   control,
  //   name: "test",
  // });

  const handleappendupdate = () => {
    append({ Desc: "", qty: "", Rating: "", Amount: "" });
  };

  const handleChange = () => {
    let subamount = 0;
    const arr = getValues().test.map((item) => {
      // console.log("item-------arrrrrrrrrrrr-----", item);
      item.Amount =
        item.qty && item.Rating
          ? parseInt(item.qty) * parseInt(item.Rating)
          : 0;
      subamount = subamount + item.Amount;
      // console.log("subamount-------arrrrrrrrrrrr-----", subamount);
    });
    setSubTotals(subamount);
  };

  const handleDiscountValue = (e) => {
    let dis = e.target.value;
    let discount = dis / 100;
    let discountvalue = subTotals - subTotals * discount;
    setTotal(discountvalue);
    setDiscount(e.target.value);
  };

  const handleTaxValue = (e) => {
    let discounts = discount / 100;
    let discountvalue = subTotals - subTotals * discounts;
    let tax = (parseInt(e.target.value ? e.target.value : 0) / 100) * subTotals;
    let calculate = discountvalue + tax;
    setTotal(calculate);
    setTax(e.target.value);
  };

  const handleShipping = (e) => {
    let discounts = discount / 100;
    let discountvalue = subTotals - subTotals * discounts;
    let taxs = (tax / 100) * subTotals;
    let calculate = discountvalue + taxs + parseInt(e.target.value);
    setTotal(calculate);
    setShipping(e.target.value);
  };

  const handlePaidAmount = (e) => {
    let balance = total - e.target.value;
    setBalanceDue(balance);
    setAmount(e.target.value);
  };

  const onSubmit = async (e) => {

    // e.preventDefault();
    // console.log(
    //   "invoiceForm.clientDetail.name--------------------->",
    //   invoiceForm.clientDetail.name
    // );

    const invoiceDetail = {
      clientName: e.clientName,
      clientAddress: e.clientAddress,
      clientEmail: e.clientEmail,
      clientNo: e.clientNo,
      invoiceNo: e.invoiceNo,
      changeCurrency: e.changeCurrency,
      createdDate: creationDate,
      Duedate: dueDate,
      test: e.test,
      Tax: tax,
      Discount: discount,
      shipping: shipping,
      Balance: balanceDue,
      Amount: amount,
      Total: total,
      subtotal: subTotals,
    };

    localStorage.setItem("details", JSON.stringify(invoiceDetail));


    // dispatch(Invoicedetails(invoiceDetail)).then((result) => {
    //     if (result.payload) {
    //         Swal.fire('Invoice Details Saved Successfully');
    //         // navigate('/')
    //     }

    // })
    // try {
    //   const response = await Axios.post('http://localhost:8000/api/invoices', invoiceDetail);
    //   console.log("res------->", response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const onDeleteProduct = useCallback((prodID) => {
    setInvoiceForm((prev) => {
      let updatedData = { ...prev };
      const updateProducts = prev.products.filter((prod) => prod.id !== prodID);
      const subTotalAmount = sumProductTotal(updateProducts);
      const updateTaxes = getTotalTaxesWithPercent(prev.taxes, subTotalAmount);
      updatedData.products = updateProducts;
      updatedData.taxes = updateTaxes;
      updatedData.totalAmount = sumTotalAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return updatedData;
    });
  }, []);

  const handlerInvoiceValue = useCallback((event, keyName) => {
    const value =
      typeof event === "string" ? new Date(event) : event?.target?.value;

    setInvoiceForm((prev) => {
      return { ...prev, [keyName]: value };
    });
  }, []);

  const handlerProductValue = useCallback(
    (event, keyName, productID) => {
      const value = event.target.value;

      // If Keyname Price or Quantity must be only number
      if (keyName === "quantity") {
        if (!`${value}`.match(/^\d+$/)) {
          return;
        }
      }

      if (keyName === "amount") {
        if (!`${value}`.match(/^[0-9]\d*(\.\d+)?$/)) {
          return;
        }
      }

      // Quantity Zero Case
      if ((keyName === "quantity" || keyName === "amount") && value <= 0) {
        return;
      }

      let updatedData = { ...invoiceForm };
      let updateProducts = [...invoiceForm.products];

      const isFindIndex = updateProducts.findIndex(
        (prod) => prod.id === productID
      );

      if (isFindIndex !== -1) {
        updateProducts[isFindIndex] = {
          ...updateProducts[isFindIndex],
          [keyName]: value,
        };

        updatedData.products = [...updateProducts];
      }

      if (keyName === "quantity" || keyName === "amount") {
        const subTotalAmount = sumProductTotal(updateProducts);
        const updateTaxes = getTotalTaxesWithPercent(
          invoiceForm.taxes,
          subTotalAmount
        );
        updatedData.taxes = updateTaxes;
        updatedData.totalAmount = sumTotalAmount(
          subTotalAmount,
          sumTotalTaxes(updateTaxes)
        );
      }
      setInvoiceForm(updatedData);
    },
    [invoiceForm]
  );

  const handlerTaxesValue = useCallback(
    (event, keyName, taxID) => {
      const value = event.target.value;
      let updateTaxes = [...invoiceForm.taxes];
      const isFindIndex = updateTaxes.findIndex((prod) => prod.id === taxID);
      if (isFindIndex === -1) {
        return;
      }
      const currentTax = updateTaxes[isFindIndex];

      if (currentTax.type === "percentage" && keyName === "value") {
        if (!`${value}`.match(/^[0-9]\d*(\.\d+)?$/)) {
          return;
        }

        if (value <= 0 || value > 100) {
          return;
        }
      }

      if (currentTax.type === "flat" && keyName === "value") {
        if (!`${value}`.match(/^[0-9]\d*(\.\d+)?$/)) {
          return;
        }

        if (value <= 0) {
          return;
        }
      }

      setInvoiceForm((prev) => {
        let taxes = [...prev.taxes];

        if (keyName === "value") {
          const subTotalAmount = sumProductTotal(prev.products);
          const amount = (value / 100) * subTotalAmount;
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value,
            amount: currentTax.type !== "percentage" ? value : amount,
          };
          const totalAmount = sumTotalAmount(
            subTotalAmount,
            sumTotalTaxes(taxes)
          );
          return { ...prev, taxes: taxes, totalAmount: totalAmount };
        } else {
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value,
          };
          return { ...prev, taxes: taxes };
        }
      });
    },
    [invoiceForm]
  );

  const handlerInvoiceClientValue = useCallback((event, keyName) => {
    const value =
      typeof event === "string" ? new Date(event) : event?.target?.value;

    setInvoiceForm((prev) => {
      return {
        ...prev,
        clientDetail: { ...prev.clientDetail, [keyName]: value },
      };
    });
  }, []);

  // Calculation for Showing
  const subTotal = useMemo(() => {
    if (!invoiceForm) {
      return 0;
    }

    if (!invoiceForm?.products) {
      return 0;
    }
    return sumProductTotal(invoiceForm.products);
  }, [invoiceForm]);

  const totalPercentTax = useMemo(() => {
    const isSomeTax = invoiceForm?.taxes?.some(
      (tax) => tax.type === "percentage"
    );

    if (!isSomeTax) {
      return 0;
    }

    const findIndex = invoiceForm?.taxes?.findIndex(
      (tax) => tax.type === "percentage"
    );

    return findIndex !== -1
      ? Number.isInteger(invoiceForm.taxes[findIndex].amount)
        ? invoiceForm.taxes[findIndex].amount
        : invoiceForm.taxes[findIndex].amount.toFixed(4).toString().slice(0, -2)
      : 0;
  }, [invoiceForm]);

  const addPercentageTax = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) => form.type === "percentage"
    );

    if (isSomeTaxes) {
      toast.error("Already Have Percentage Taxes!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const amount = (10 / 100) * subTotalAmount;
      const percentageTax = {
        id: nanoid(),
        title: "Tax %",
        type: "percentage",
        value: 10,
        amount,
      };
      const updateTaxes = [percentageTax, ...prev.taxes];
      const totalAmount = sumTotalAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );

      return {
        ...prev,
        taxes: updateTaxes,
        totalAmount: totalAmount,
      };
    });
  }, [invoiceForm]);

  const addEmptyTax = useCallback(() => {
    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const emptyTax = {
        id: nanoid(),
        title: "Extra Fees",
        type: "flat",
        value: 1,
        amount: 1,
      };
      const updateTaxes = [...prev.taxes, emptyTax];
      const totalAmount = sumTotalAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return { ...prev, taxes: updateTaxes, totalAmount };
    });
  }, []);

  const onDeleteTax = useCallback((taxID) => {
    setInvoiceForm((prev) => {
      const updateTaxes = prev.taxes.filter((prod) => prod.id !== taxID);
      let updatedData = { ...prev, taxes: updateTaxes };
      const subTotalAmount = sumProductTotal(prev.products);
      const totalAmount = sumTotalAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      updatedData.totalAmount = totalAmount;
      return updatedData;
    });
  }, []);

  const saveAs = useCallback(
    (status) => {
      setStatusData({
        statusIndex: status === "Draft" ? "1" : status === "Unpaid" ? "2" : "3",
        statusName: status,
      });
      // dispatch(setConfirmModalOpen(true));
      Swal.fire("Invoice Details Saved Successfully");
    },
    [dispatch]
  );

  const goInvoiceList = useCallback(() => {
    // navigate("/invoices");
  }, [navigate]);

  useEffect(() => {
    if (selectedProduct !== null) {
      // If Choosen Exisiting Client And This form is news
      const { name, productID, amount } = selectedProduct;
      const newProduct = {
        id: nanoid(),
        name,
        productID,
        amount,
        quantity: 1,
      };

      setInvoiceForm((prev) => {
        let updatedData = { ...prev };
        const updateProducts = [...prev.products, newProduct];
        const subTotalAmount = sumProductTotal(updateProducts);
        const updateTaxes = getTotalTaxesWithPercent(
          prev.taxes,
          subTotalAmount
        );
        updatedData.products = updateProducts;
        updatedData.taxes = updateTaxes;
        updatedData.totalAmount = sumTotalAmount(
          subTotalAmount,
          sumTotalTaxes(updateTaxes)
        );
        return updatedData;
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (initLoading === false) {
      if (params.id === "new" && invoiceForm === null) {
        // If New I ignore Company Data,
        // Everytime we set current company Data
        setInvoiceForm({
          ...invoiceNewForm,
          companyDetail: { ...company },
          dueDate: new Date(invoiceNewForm.dueDate),
          createdDate: new Date(),
        });

        dispatch(setDefaultBackground(invoiceNewForm.backgroundImage));
        dispatch(setDefaultColor(invoiceNewForm.color));
      } else if (params.id !== "new" && invoiceForm === null) {
        // Else Exisiting Invoice,
        // We'll Set Company Data
        // But if it's Draft, we'll currenty set the data for Current Company Data
        // Because it's still Draft State
        const getInvoiceDetail = allInvoiceDetails.find(
          (inv) => inv.id === params.id
        );

        // If not Found Redirect Back
        // navigate("/");
        if (!getInvoiceDetail) {
          // navigate("/invoices");

          setInvoiceForm({
            ...invoiceNewForm,
            companyDetail: { ...company },
            dueDate: new Date(invoiceNewForm.dueDate),
            createdDate: new Date(),
          });
          return;
        } else {
          setInvoiceForm({
            ...getInvoiceDetail,
            companyDetail: { ...getInvoiceDetail.companyDetail },
            dueDate: new Date(getInvoiceDetail.dueDate),
            createdDate: new Date(getInvoiceDetail.createdDate),
          });

          dispatch(setDefaultBackground(getInvoiceDetail.backgroundImage));
          dispatch(setDefaultColor(getInvoiceDetail.color));
          setIsViewMode(true);
        }
      }
    }
  }, [
    params,
    invoiceForm,
    navigate,
    invoiceNewForm,
    initLoading,
    company,
    dispatch,
    allInvoiceDetails,
  ]);

  useEffect(() => {
    if (selectedClient !== null) {
      // If Choosen Exisiting Client And This form is news
      setInvoiceForm((prev) => {
        return {
          ...prev,
          clientDetail: { ...selectedClient },
        };
      });
    }
  }, [selectedClient]);

  useEffect(() => {
    // if (invoiceForm.produ)
    if (params.id === "new" && invoiceForm !== null) {
      dispatch(updateNewInvoiceForm(invoiceForm));
    } else if (params.id !== "new" && invoiceForm !== null) {
      dispatch(updateExisitingInvoiceForm(invoiceForm));
    }
  }, [dispatch, invoiceForm, params]);

  useEffect(() => {
    if (initLoading === false) {
      setInvoiceForm((prev) => ({
        ...prev,
        backgroundImage: currentBg,
        color: currentColor,
      }));
    }
  }, [currentBg, currentColor, initLoading]);

  const { user } = useSelector((state) => state.user);
  let userDetail = sessionStorage.getItem("user", JSON.stringify("user"));

  // On Confirm Dependencies
  useEffect(() => {
    if (isConfirm) {
      const isNew = params.id === "new";
      if (isNew) {
        dispatch(setIsConfirm(false));
        dispatch(setNewInvoices({ ...invoiceForm, ...statusData }));
        setInvoiceForm({
          ...invoiceForm,
          products: [
            {
              amount: 1200,
              id: nanoid(),
              name: "productName",
              productID: "",
              quantity: 1,
            },
          ],
          taxes: [],
          totalAmount: 1200,
        });

        setTimeout(() => {
          navigate("/invoices");
        }, 300);
      } else {
        // Update Exisiting Invoice
        dispatch(setIsConfirm(false));
        setIsViewMode(true);
        setInvoiceForm({
          ...invoiceForm,
          ...statusData,
        });
      }
    }
  }, [dispatch, invoiceForm, isConfirm, navigate, params, statusData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4">
        <PageTitle
          title={
            <>
              {params.id !== "new"
                ? "New Invoice"
                : `Invoice Detail ${invoiceForm?.statusName}`}
            </>
          }
        />
      </div>
      <div className="px-4 pb-3">
        <InvoiceTopBar
          onClickBack={goInvoiceList}
          viewMode={isViewMode}
          onClickViewAs={toggleViewMode}
          onClickSetting={openSettingModal}
          onClickExport={handleExport}
          onClickDownloadImg={handleDownloadImg}
        />
      </div>

      {invoiceForm && (
        <div
          className={
            isExporting
              ? "bg-white mb-1 pt-1 px-1 "
              : "bg-white mx-4 rounded-xl mb-1"
          }
          id="InvoiceWrapper"
          ref={componentRef}
          style={isExporting ? { width: 1200 } : {}}
          onChange={handleChange}
        >
          {/* Background Image */}
          <div
            className={
              isExporting
                ? "py-5 px-8 bg-cover bg-center bg-slate-50 rounded-xl flex flex-row justify-between items-center"
                : "py-9 px-8 bg-cover bg-center bg-slate-50 rounded-xl flex flex-col sm:flex-row justify-between items-center"
            }
            style={{
              backgroundImage: `url(${invoiceForm?.backgroundImage?.base64})`,
            }}
          >
            <div
              className={
                isExporting
                  ? "flex xflex-row items-center"
                  : "flex flex-col sm:flex-row items-center"
              }
            >
              {invoiceForm?.companyDetail?.image ? (
                <img
                  className="object-contain h-20 w-20 mr-3 rounded"
                  alt={invoiceForm?.companyDetail?.companyName}
                  src={invoiceForm?.companyDetail?.image}
                />
              ) : (
                <span></span>
              )}

              <div
                className={
                  isExporting
                    ? "text-white font-title text-left"
                    : "text-white font-title text-center sm:text-left"
                }
              >
                <p className="font-bold mb-2">
                  {invoiceForm?.companyDetail?.companyName || "Company Name"}
                </p>
                <p className="text-sm font-medium">
                  {invoiceForm?.companyDetail?.billingAddress ||
                    "Plz add First Company Data"}
                </p>
                <p className="text-sm font-medium">
                  {invoiceForm?.companyDetail?.companyMobile || "Company Ph"}
                </p>
                <p className="text-sm font-medium">
                  {invoiceForm?.companyDetail?.companyEmail ||
                    "Company@email.com"}
                </p>
              </div>
            </div>
            <div className="text-white font-title font-bold text-5xl mt-5 sm:mt-0">
              Invoice
            </div>
          </div>
          {/* Background Image Finished */}

          {/* Customer Billing Info */}
          <div
            className={
              isExporting
                ? "flex flex-row pt-2 px-8"
                : "flex flex-col sm:flex-row pt-3 px-8"
            }
          >
            <div className="flex-1">
              <div className="flex flex-row">
                <div className="font-title font-bold">Billing To</div>
                <div className="w-1/2 relative ml-3" style={{ top: "-3px" }}>
                  {!isViewMode && (
                    <Button size="sm" outlined={1} onClick={openChooseClient}>
                      <ClientPlusIcon className="w-4 h-4" /> Exisiting
                    </Button>
                  )}
                </div>
              </div>
              <div className="client-form-wrapper sm:w-1/2">
                <div
                  className={
                    "font-medium " + (isExporting ? "text-xs" : "text-sm mb-1")
                  }
                >
                  {!isViewMode ? (
                    <input
                      autoComplete="nope"
                      placeholder="Client Name"
                      {...register("clientName")}
                      className={defaultInputSmStyle}
                      // onChange={(e) => handlerInvoiceClientValue(e, "name")}
                    />
                  ) : (
                    invoiceForm?.clientDetail?.clientName
                  )}
                </div>
                <div
                  className={
                    "font-medium " + (isExporting ? "text-xs" : "text-sm mb-1")
                  }
                >
                  {!isViewMode ? (
                    <input
                      autoComplete="nope"
                      placeholder="Client Address"
                      className={defaultInputSmStyle}
                      {...register("clientAddress")}
                      // value={invoiceForm?.clientDetail?.billingAddress}
                      onChange={(e) =>
                        handlerInvoiceClientValue(e, "billingAddress")
                      }
                    />
                  ) : (
                    invoiceForm?.clientDetail?.billingAddress
                  )}
                </div>
                <div
                  className={
                    "font-medium " + (isExporting ? "text-xs" : "text-sm mb-1")
                  }
                >
                  {!isViewMode ? (
                    <input
                      autoComplete="nope"
                      placeholder="Client Mobile"
                      {...register("clientNo")}
                      className={defaultInputSmStyle}
                      // value={invoiceForm?.clientDetail?.mobileNo}
                      onChange={(e) => handlerInvoiceClientValue(e, "mobileNo")}
                    />
                  ) : (
                    invoiceForm?.clientDetail?.mobileNo
                  )}
                </div>
                <div
                  className={
                    "font-medium " + (isExporting ? "text-xs" : "text-sm mb-1")
                  }
                >
                  {!isViewMode ? (
                    <input
                      autoComplete="nope"
                      {...register("clientEmail")}
                      placeholder="Client Email"
                      className={defaultInputSmStyle}
                      // value={invoiceForm?.clientDetail?.email}
                      onChange={(e) => handlerInvoiceClientValue(e, "email")}
                    />
                  ) : (
                    invoiceForm?.clientDetail?.email
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-row justify-between items-center mb-1">
                <div className="font-title flex-1"> INVOICE # </div>
                <div className="font-title flex-1 text-right">
                  {!isViewMode ? (
                    <input
                      autoComplete="nope"
                      placeholder="Invoice No"
                      {...register("invoiceNo")}
                      className={defaultInputSmStyle + " text-right"}
                      // value={invoiceForm.invoiceNo}
                      onChange={(e) => handlerInvoiceValue(e, "invoiceNo")}
                    />
                  ) : (
                    invoiceForm.invoiceNo || "-"
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center mb-1">
                <div className="font-title flex-1"> Creation Date </div>
                <div className="font-title flex-1 text-right">
                  <input
                    type="date"
                    autoComplete="nope"
                    placeholder=""
                    className={
                      " text-right text-right bg-white w-48 border-solid border-2 border-indigo-300 h-8 text-sm  rounded-xl focus:outline-none "
                    }
                    onChange={(e) => setCreationDate(e.target.value)}
                    value={creationDate ? creationDate : ""}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between items-center mb-1">
                <div className="font-title flex-1"> Due Date </div>
                <div className="font-title flex-1 text-right">
                  <input
                    type="date"
                    autoComplete="nope"
                    placeholder=""
                    className={
                      " text-right text-right bg-white w-48 border-solid border-2 border-indigo-300 h-8 text-sm  rounded-xl focus:outline-none "
                    }
                    onChange={(e) => setDueDate(e.target.value)}
                    value={dueDate ? dueDate : ""}
                  />
                </div>
              </div>
              {!isViewMode && (
                <div className="flex flex-row justify-between items-center mb-1">
                  <div className="font-title flex-1"> Change Currency </div>
                  <div className="font-title flex-1 text-right">
                    <input
                      autoComplete="nope"
                      placeholder="Invoice No"
                      {...register("changeCurrency")}
                      className={defaultInputSmStyle + " text-right"}
                      // value={invoiceForm.currencyUnit}
                      onChange={(e) => handlerInvoiceValue(e, "currencyUnit")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Customer Billing Info Finished */}

          {/* Products */}

          <div className="py-2 px-4">
            <div
              className={
                isExporting
                  ? "flex rounded-lg w-full flex-row px-4 py-1 text-white"
                  : "hidden sm:flex rounded-lg invisible sm:visible w-full flex-col sm:flex-row px-4 py-2 text-white"
              }
              style={{ backgroundColor: invoiceForm.color }}
            >
              <div
                className={
                  "font-title " +
                  (isExporting
                    ? " text-sm w-1/4 text-right pr-10"
                    : " w-full sm:w-1/4 text-right sm:pr-10")
                }
              >
                <span className="inline-block">Description</span>
              </div>
              <div
                className={
                  "font-title " +
                  (isExporting
                    ? " text-sm  w-1/4 text-right pr-10"
                    : " w-full sm:w-1/4 text-right sm:pr-10")
                }
              >
                Price
              </div>
              <div
                className={
                  "font-title " +
                  (isExporting
                    ? " text-sm  w-1/4 text-right pr-10"
                    : " w-full sm:w-1/4 text-right sm:pr-10")
                }
              >
                Qty
              </div>
              <div
                className={
                  "font-title" +
                  (isExporting
                    ? " text-sm w-1/4 text-right pr-10"
                    : "  w-full sm:w-1/4 text-right sm:pr-10")
                }
              >
                Total
              </div>
            </div>

            {fields ? (
              <>
                {fields.map(({ id }, index) => {
                  return (
                    <div
                      className={
                        (isExporting
                          ? "flex flex-row rounded-lg w-full px-4 py-1 items-center relative text-sm"
                          : "flex flex-col sm:flex-row rounded-lg sm:visible w-full px-4 py-2 items-center relative") +
                        " bg-gray-50 "
                      }
                    >
                      <div
                        className={
                          isExporting
                            ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                            : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
                        }
                      >
                        {!isExporting && (
                          <span className="sm:hidden w-1/2 flex flex-row items-center">
                            Description
                          </span>
                        )}
                        <span
                          className={
                            isExporting
                              ? "inline-block w-full mb-0"
                              : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                          }
                        >
                          {!isViewMode ? (
                            <input
                              autoComplete="nope"
                              // value={product.name}
                              name={`test.${index}.Desc`}
                              {...register(`test.${index}.Desc`, {
                                required: false,
                              })}
                              placeholder="Product Name"
                              className={defaultInputSmStyle + " text-right"}
                            />
                          ) : (
                            <span className="pr-3"></span>
                          )}
                        </span>
                      </div>
                      <div
                        className={
                          isExporting
                            ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                            : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
                        }
                      >
                        {!isExporting && (
                          <span className="sm:hidden w-1/2 flex flex-row items-center">
                            Price
                          </span>
                        )}
                        <span
                          className={
                            isExporting
                              ? "inline-block w-full mb-0"
                              : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                          }
                        >
                          {!isViewMode ? (
                            <input
                              autoComplete="nope"
                              // value={product.amount}
                              {...register(`test.${index}.Rating`, {
                                required: false,
                              })}
                              name={`test.${index}.Rating`}
                              placeholder="Price"
                              type={"number"}
                              className={defaultInputSmStyle + " text-right"}
                            />
                          ) : (
                            <span className="pr-3">
                              <NumberFormat
                                // value={product.amount}
                                className=""
                                displayType={"text"}
                                thousandSeparator={true}
                                renderText={(value, props) => (
                                  <span {...props}>{value}</span>
                                )}
                              />
                            </span>
                          )}
                        </span>
                      </div>
                      <div
                        className={
                          isExporting
                            ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                            : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
                        }
                      >
                        {!isExporting && (
                          <span className="sm:hidden w-1/2 flex flex-row items-center">
                            Quantity
                          </span>
                        )}
                        <span
                          className={
                            isExporting
                              ? "inline-block w-full mb-0"
                              : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                          }
                        >
                          {!isViewMode ? (
                            <input
                              autoComplete="nope"
                              // value={product.quantity}
                              type={"number"}
                              placeholder="Quantity"
                              className={defaultInputSmStyle + " text-right"}
                              {...register(`test.${index}.qty`, {
                                required: false,
                                pattern: {
                                  value: /^[1-9]\d*(\d+)?$/i,
                                  message: "Please enter an integer",
                                },
                              })}
                              name={`test.${index}.qty`}
                            />
                          ) : (
                            <span className="pr-3">
                              <NumberFormat
                                // value={product.quantity}
                                className=""
                                displayType={"text"}
                                thousandSeparator={true}
                                renderText={(value, props) => (
                                  <span {...props}>{value}</span>
                                )}
                              />
                            </span>
                          )}
                        </span>
                      </div>
                      <div
                        className={
                          isExporting
                            ? "font-title w-1/4 text-right pr-9 flex flex-row `1block"
                            : "font-title w-full sm:w-1/4 text-right sm:pr-9 flex flex-row sm:block"
                        }
                      >
                        {/* {!isExporting && (
                        <span className="sm:hidden w-1/2 flex flex-row items-center"
                        >
                          Total
                        </span>
                      )}

                      <span
                        className={
                          isExporting
                            ? "inline-block w-full "
                            : "inline-block w-1/2 sm:w-full"
                        }
                      >
                        <NumberFormat
                          name={`test.${index}.Amount`}
                          value={getValues().test[index].Amount}
                          className=""
                          displayType={"text"}

                        // thousandSeparator={true}
                        // renderText={(value, props) => (
                        //   <span {...props}>{value}</span>
                        // )}
                        /> */}
                        {/* {invoiceForm?.currencyUnit} */}
                        {/* </span> */}
                        <span
                          className={
                            isExporting
                              ? "inline-block w-full mb-0"
                              : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
                          }
                        >
                          {!isViewMode ? (
                            <input
                              autoComplete="nope"
                              // value={product.quantity}
                              placeholder="Total"
                              className={defaultInputSmStyle + " text-right"}
                              name={`test.${index}.Amount`}
                              {...register(`test.${index}.Amount`)}
                              value={getValues().test[index].Amount}
                            />
                          ) : (
                            <span className="pr-3"></span>
                          )}
                        </span>
                      </div>
                      {!isViewMode && (
                        <div className="w-full sm:w-10 sm:absolute sm:right-0">
                          <div className="w-full text-red-500 font-title h-8 sm:h-8 sm:w-8 cursor-pointer rounded-2xl bg-red-200 mr-2 flex justify-center items-center">
                            <DeleteIcon
                              className="h-4 w-4"
                              style={IconStyle}
                              onClick={() => remove(index)}
                            />
                            <span className="block sm:hidden">
                              Delete Product
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}

            {/* Add Product Actions */}
            {!isViewMode && (
              <div className="flex flex-col sm:flex-row rounded-lg sm:visible w-full px-4 py-2 items-center sm:justify-end">
                <div className="font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1">
                  <Button size="sm" block={1} onClick={handleappendupdate}>
                    <PlusCircleIcon style={IconStyle} className="h-5 w-5" />
                    Add Empty Product
                  </Button>
                </div>
                <div className="font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1">
                  <Button size="sm" block={1} onClick={openChooseProduct}>
                    <InvoiceIcon style={IconStyle} className="w-5 h-5" />
                    Add Exisiting Product
                  </Button>
                </div>
              </div>
            )}
            {/* Add Product Actions Finished*/}

            {/* Subtotal Start */}
            <div
              className={
                isExporting
                  ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                  : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
              }
            >
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1 sm:mb-0"
                }
              >
                Subtotal
              </div>
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <NumberFormat
                  value={subTotals ? subTotals : ""}
                  className="inline-block"
                  displayType={"text"}
                />
              </div>
            </div>
            {/* Subtotal Finished */}

            {/* discount */}
            <div
              className={
                isExporting
                  ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                  : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
              }
            >
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <input
                  className={defaultInputSmStyle + " text-right"}
                  value={"Discount"}
                />
              </div>
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <input
                  autoComplete="nope"
                  type={"number"}
                  placeholder="discount"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => handleDiscountValue(e)}
                  value={discount ? discount : ""}
                />
              </div>
            </div>
            {/* discount finished*/}

            {/* Taxes */}
            <div
              className={
                isExporting
                  ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                  : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
              }
            >
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1 sm:mb-0"
                }
              >
                <input
                  className={defaultInputSmStyle + " text-right"}
                  value={"Tax %"}
                />
              </div>
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <input
                  autoComplete="nope"
                  type={"number"}
                  placeholder="Percentage"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => handleTaxValue(e)}
                  value={tax ? tax : ""}
                />
              </div>
            </div>
            {/* Taxes finished*/}

            {/* shipping */}
            <div
              className={
                isExporting
                  ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                  : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
              }
            >
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1 sm:mb-0"
                }
              >
                <input
                  className={defaultInputSmStyle + " text-right"}
                  value={"Shipping"}
                />
              </div>
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <input
                  autoComplete="nope"
                  type={"number"}
                  placeholder="Percentage"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => handleShipping(e)}
                  value={shipping ? shipping : ""}
                />
              </div>
            </div>
            {/* shipping finished*/}

            {/*  Amount Paid */}
            <div
              className={
                isExporting
                  ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                  : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
              }
            >
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1 sm:mb-0"
                }
              >
                <input
                  className={defaultInputSmStyle + " text-right"}
                  value={"Amount Paid"}
                />
              </div>
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <input
                  autoComplete="nope"
                  type={"number"}
                  placeholder="Percentage"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => handlePaidAmount(e)}
                  value={amount ? amount : ""}
                />
              </div>
            </div>
            {/*  Amount Paid finished*/}

            {/*  Balance Due Paid */}
            <div
              className={
                isExporting
                  ? "flex flex-row rounded-lg w-full px-4 py-1 justify-end items-end relative text-sm"
                  : "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
              }
            >
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block mb-1 sm:mb-0"
                }
              >
                <input
                  className={defaultInputSmStyle + " text-right"}
                  value={" Balance Due"}
                  {...register("balance")}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>
              <div
                className={
                  isExporting
                    ? "font-title w-1/4 text-right pr-9 flex flex-row block justify-end text-sm "
                    : "font-title w-1/2 sm:w-1/4 text-right sm:pr-9 flex flex-row justify-end sm:block mb-1"
                }
              >
                <input
                  autoComplete="nope"
                  type={"number"}
                  placeholder="Percentage"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => setBalanceDue(e.target.value)}
                  value={balanceDue ? balanceDue : ""}
                />
              </div>
            </div>
            {/*  Balance Due finished*/}

            {/* Subtotal Start */}
            <div
              className={
                isExporting
                  ? "flex flex-row justify-end w-full items-center text-white"
                  : "flex flex-row sm:flex-row sm:justify-end w-full items-center text-white"
              }
            >
              <div
                className={
                  isExporting
                    ? "w-1/2 px-4 py-1 flex flex-row rounded-lg items-center"
                    : "w-full sm:w-1/2 px-4 py-1 flex flex-row rounded-lg items-center"
                }
                style={{ backgroundColor: invoiceForm.color }}
              >
                <div
                  className={
                    isExporting
                      ? "font-title text-base w-1/2 text-right pr-9 flex flex-row block  justify-end items-center"
                      : "font-title text-lg w-1/2 text-right sm:pr-9 flex flex-row sm:block items-center"
                  }
                >
                  Total
                </div>
                <div
                  className={
                    isExporting
                      ? "font-title text-lg w-1/2 text-right pr-9 flex flex-row block  justify-end items-center"
                      : "font-title text-lg w-1/2 text-right sm:pr-9 flex flex-row justify-end sm:block items-center"
                  }
                >
                  <NumberFormat
                    className=""
                    displayType={"text"}
                    thousandSeparator={true}
                    onChange={(e) => setTotal(e.target.value)}
                    value={total ? total : ""}
                  />
                </div>
              </div>
            </div>
            {/* Subtotal Finished */}
          </div>
          {/* Products Finished */}
        </div>
      )}

      {invoiceForm && invoiceForm?.statusIndex !== "3" && (
        <div className="px-4 pt-3">
          <div className="bg-white rounded-xl px-3 py-3">
            <div className="flex flex-col flex-wrap sm:flex-row justify-end">
              {/* <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                            <Button
                                outlined={1}
                                size="sm"
                                block={1}
                                secondary={1}
                                onClick={() => saveAs("Draft")}
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-1" /> Save As Draft
                            </Button>
                        </div> */}
              {/* <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                            <Button
                                outlined={1}
                                size="sm"
                                block={1}
                                danger={1}
                                onClick={() => saveAs("Unpaid")}
                            >
                                <DollarIcon className="h-5 w-5 mr-1" />{" "}
                                {params.id !== "new" ? "Save" : "Update"} As Unpaid
                            </Button>
                        </div> */}
              <div className="w-1/2  my-1 sm:my-1 md:my-0 px-1 ">
                <Button
                  size="sm"
                  block={1}
                  success={1}
                  type="submit"
                  // onClick={(e) => { saveInvoiceDetail(e) }}
                >
                  <SecurityIcon className="h-5 w-5 mr-1" />{" "}
                  {params.id !== "new" ? "Save" : "Update"} As Paid
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {invoiceForm && (
                <div className="p-4">
                    <InvoiceTopBar
                        onClickBack={goInvoiceList}
                        viewMode={isViewMode}
                        onClickViewAs={toggleViewMode}
                        onClickSetting={openSettingModal}
                        onClickExport={handleExport}
                        onClickDownloadImg={handleDownloadImg}
                    />
                </div>
            )} */}
    </form>
  );
}

export default HomeScreen;
