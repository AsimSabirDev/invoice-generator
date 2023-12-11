"use client"

import React, { useState, useEffect } from 'react';
import CurrencyDropdown from '@/components/CurrencyDropdown/CurrencyDropdown';
import currencyData from '../data/currency.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {HalfCircleSpinner} from "react-epic-spinners";

export default function Home() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseOrder, setPurchaseOrder] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyDetails, setCompanyDetails] = useState('');
  const [clientDetails, setClientDetails] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('');
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState([{ id: 1, desc: '', rate: '', qty: '', total: 0 }]);
  const [desc, setDesc] = useState('');
  const [number, setNumber] = useState('');
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [formattedSubtotal, setFormattedSubtotal] = useState('0.00');
  const [terms, setTerms] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [tax, setTax] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [shippingFee, setShippingFee] = useState<string>('');
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  let taxValue: number = parseFloat(tax) || 0;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

      if (file.size > fileSizeLimit) {
        alert('File size exceeds the limit of 5MB');
        return;
      }

      if (!allowedFileTypes.includes(file.type)) {
        alert('Invalid file type. Please select a JPG, PNG, or SVG file.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleCurrencyChange = (currency: string, code: string, symbol: string) => {
    setSelectedCurrency(currency);
    setSelectedCurrencyCode(code);
    setSelectedCurrencySymbol(symbol);
  };

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      desc: '',
      rate: '',
      qty: '',
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };

  const handleInputChange = (itemId, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);

    if (field === 'desc') {
      setDesc(value);
    } else if (field === 'number') {
      setNumber(value);
    } else if (field === 'qty') {
      setQty(value);
    } else if (field === 'rate') {
      setRate(value);
    }
  };

  useEffect(() => {
    const newSubtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
    const newFormattedSubtotal = newSubtotal % 1 === 0 ? newSubtotal.toFixed(0) : newSubtotal.toFixed(2);

    setSubtotal(newSubtotal);
    setFormattedSubtotal(newFormattedSubtotal);
  }, [items]);

  useEffect(() => {
    const discountValue = parseFloat(discount) || 0;
    const shippingFeeValue = parseFloat(shippingFee) || 0;

    const invoiceTotal = subtotal + (subtotal * (taxValue / 100)) + shippingFeeValue - discountValue;
    const formattedInvoiceTotal = invoiceTotal % 1 === 0 ? invoiceTotal.toFixed(0) : invoiceTotal.toFixed(2);

    setInvoiceTotal(parseFloat(formattedInvoiceTotal));
  }, [subtotal, tax, discount, shippingFee]);

  const handleCreateInvoice = () => {
    const invoiceContent = document.getElementById('pdf-template');
    const originalDisplay = invoiceContent.style.display;

    // Set temporary display to 'block' for rendering
    invoiceContent.style.display = 'block';
    setIsGeneratingPDF(true);

    const pdf = new jsPDF('p', 'mm', 'a4');

    html2canvas(invoiceContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Reset display to original value
      invoiceContent.style.display = originalDisplay;
      setIsGeneratingPDF(false);

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 0);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <main>
      <section className="invoice-section relative py-12">
        <div className="container mx-auto px-5 sm:px-1.5">
          <div className="hero">
            <div className="hero-content text-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold uppercase">Free invoice generator.</h1>
                <p className="py-6">Create an invoice online with our free invoice maker in moments.</p>
              </div>
            </div>
          </div>
          <div className="invoice-generator">
            <form className="invoice-generate-form">
              <div className="bg-white shadow-lg rounded-xl pb-4 sm:p-4 md:p-8">
                <div className="invoice-generator__section p-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:gap-y-8 sm:grid-cols-8">
                    <div className="sm:col-span-4 md:col-span-2">
                      <label
                        htmlFor="invoice-number"
                        className="block text-sm leading-6"
                      >Invoice number</label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="invoice-number"
                          id="invoice-number"
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 h-11 px-4"
                          value={invoiceNumber}
                          onChange={(e)=>setInvoiceNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 md:col-span-2">
                      <label
                        htmlFor="purchase-order"
                        className="block text-sm leading-6"
                      >Purchase order</label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="purchase-order"
                          id="purchase-order"
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 h-11 px-4"
                          value={purchaseOrder}
                          onChange={(e) => setPurchaseOrder(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-8 md:col-span-4">
                      <label
                        className="block text-sm leading-6"
                      >Logo</label>
                      <div className="mt-2">
                        <label
                          htmlFor="logo"
                          className={`btn-logo-upload block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 ${selectedFile && 'file-uploaded'}`}
                        >
                          <div className="flex items-center media-wrap">
                            <div className="logo-upload-icon">
                              <span className="icon-upload">
                                {selectedFile ?
                                  <svg width="16" height="16" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                                    <path d="M20.143 6.427 9.557 16.97 4.2 11.57 3 12.77l5.957 6a.846.846 0 0 0 .6.257.846.846 0 0 0 .6-.257L21.343 7.627l-1.2-1.2Z"></path>
                                  </svg>
                                  :
                                  <svg width="24" height="24" fill="currentColor" focusable="false" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.714 1.713h20.572v1.714H1.714V1.713Zm3.6 10.583L11.4 6.253a.829.829 0 0 1 1.2 0l6.043 6.043-1.2 1.2-4.586-4.585v13.371h-1.714V8.911l-4.629 4.585-1.2-1.2Z"></path>
                                  </svg>
                                }
                              </span>
                            </div>
                            <div className="media-body text-xs-left">
                              <div className="text-large">{selectedFile ? selectedFile.name : 'Upload file'}</div>
                              <div className="text-small">{selectedFile ? 'Uploaded' : 'JPG, JPEG, PNG, less than 5MB'}</div>
                            </div>
                          </div>
                        </label>
                        <input type="file" name="logo" id="logo" onChange={handleFileChange} className="sr-only" />
                      </div>
                    </div>
                    <div className="sm:col-span-8 md:col-span-4">
                      <label
                        htmlFor="company-details"
                        className="block text-sm leading-6"
                      >Your company details</label>
                      <div className="mt-2">
                        <textarea
                          rows="3"
                          name="company-details"
                          id="company-details"
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 px-4 py-3"
                          value={companyDetails}
                          onChange={(e) => setCompanyDetails(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="sm:col-span-8 md:col-span-4">
                      <label
                        htmlFor="client-details"
                        className="block text-sm leading-6"
                      >Bill to</label>
                      <div className="mt-2">
                        <textarea
                          rows="3"
                          name="client-details"
                          id="client-details"
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 px-4 py-3"
                          value={clientDetails}
                          onChange={(e) => setClientDetails(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="sm:col-span-8 md:col-span-4">
                      <label
                        className="block text-sm leading-6"
                      >Currency</label>
                      <div className="mt-2">
                        <CurrencyDropdown
                          selectedCurrency={selectedCurrency}
                          onChange={handleCurrencyChange}
                          currencies={currencyData}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 md:col-span-2">
                      <label
                        className="block text-sm leading-6"
                      >Invoice date</label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="invoice-date"
                          id="invoice-date"
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 h-11 px-4"
                          value={invoiceDate}
                          onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 md:col-span-2">
                      <label
                        className="block text-sm leading-6"
                      >Due date</label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="due-date"
                          id="due-date"
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 h-11 px-4"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="invoice-generator__items my-2 py-8 px-6">
                  {items.map((item) => (
                    <div key={item.id} className="invoice-generator__item">
                      <div className="invoice-generator__item-desc">
                        <label
                          htmlFor={`desc-item-5467${item.id}`}
                          className="block text-sm leading-6 field-label mb-2"
                        >Item description
                        </label>
                        <input
                          type="text"
                          id={`desc-item-5467${item.id}`}
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                          value={item.desc}
                          onChange={(e) => handleInputChange(item.id, 'desc', e.target.value)}
                        />
                      </div>
                      <div className="invoice-generator__item-rate">
                        <label
                          htmlFor={`rate-item-5467${item.id}`}
                          className="block text-sm leading-6 field-label mb-2"
                        >Unit Cost
                        </label>
                        <input
                          type="number"
                          id={`rate-item-5467${item.id}`}
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                          value={item.rate}
                          onChange={(e) => handleInputChange(item.id, 'rate', e.target.value)}
                        />
                      </div>
                      <div className="invoice-generator__item-qty">
                        <label
                          htmlFor={`quantity-item-5467${item.id}`}
                          className="block text-sm leading-6 field-label mb-2"
                        >Quantity
                        </label>
                        <input
                          type="number"
                          id={`quantity-item-5467${item.id}`}
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                          value={item.qty}
                          onChange={(e) => handleInputChange(item.id, 'qty', e.target.value)}
                        />
                      </div>
                      <div className="invoice-generator__item-total">
                        <label
                          htmlFor={`total-item-5467${item.id}`}
                          className="block text-sm leading-6 field-label mb-2"
                        >Amount
                        </label>
                        <input
                          type="number"
                          id={`total-item-5467${item.id}`}
                          readOnly
                          value={item.qty * item.rate}
                          className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                        />
                      </div>
                      <div className="invoice-generator__item-del">
                        <label htmlFor={`del-row-5467${item.id}`} onClick={() => handleDeleteItem(item.id)} className="btn rounded-full action-btn btn-del-item transition duration-300 ease-in-out flex items-center justify-center w-12 h-12 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </label>
                        <input type="text" className="sr-only" id={`del-row-5467${item.id}`} />
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-6 m-b-0">
                    <label htmlFor="add-row" onClick={handleAddItem} className="btn rounded-full mx-auto action-btn btn-add-item transition duration-300 ease-in-out flex items-center justify-center w-12 h-12 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                      </svg>
                    </label>
                    <span className="block text-sm leading-6 mt-1">Add Item</span>
                    <input type="text" className="sr-only" id="add-row"/>
                  </div>
                </div>
                <div className="invoice-generator__section p-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:gap-y-8 sm:grid-cols-8">
                    <div className="sm:col-span-8 md:col-span-4">
                      <div className="field-wrap mb-4">
                        <label
                          htmlFor="terms"
                          className="block text-sm leading-6"
                        >Notes / payment terms</label>
                        <div className="mt-2">
                          <textarea
                            rows="3"
                            name="terms"
                            id="terms"
                            placeholder="Payment is due within 15 days"
                            className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 px-4 py-3"
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="field-wrap mb-4">
                        <label
                          htmlFor="bank-details"
                          className="block text-sm leading-6"
                        >Bank account details</label>
                        <div className="mt-2">
                          <textarea
                            rows="3"
                            name="bank-details"
                            id="bank-details"
                            className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-md md:leading-6 px-4 py-3"
                            value={bankDetails}
                            onChange={(e) => setBankDetails(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-8 md:col-span-4">
                      <div className="flex items-center mb-5 pb-2 invoice-generator__subtotal">
                        <div className="flex-initial w-2/5 md:w-32 tx-text">
                          Subtotal
                        </div>
                        <div className="flex-initial w-3/5 md:w-64 text-right tx-text">
                          {selectedCurrencySymbol} {formattedSubtotal}
                        </div>
                      </div>
                      <div className="flex items-center mb-5">
                        <label
                          htmlFor="tax-percent"
                          className="flex-initial text-sm leading-6 w-2/5 md:w-32 mb-2"
                        >Tax %
                        </label>
                        <div className="flex-initial w-3/5 md:w-64 text-right">
                          <div className="relative">
                            <input
                              type="number"
                              name="tax-percent"
                              id="tax-percent"
                              inputMode="decimal"
                              className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                              value={tax}
                              onChange={(e) => setTax(e.target.value)}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="text-gray-500 sm:text-sm">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-5">
                        <label
                          htmlFor="discount"
                          className="flex-initial text-sm leading-6 w-2/5 md:w-32 mb-2"
                        >Discount ({selectedCurrencySymbol})
                        </label>
                        <div className="flex-initial w-3/5 md:w-64 text-right">
                          <div className="relative">
                            <input
                              type="number"
                              name="discount"
                              id="discount"
                              inputMode="decimal"
                              className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-5">
                        <label
                          htmlFor="shipping-fee"
                          className="flex-initial text-sm leading-6 w-2/5 md:w-32 mb-2"
                        >Shipping fee
                        </label>
                        <div className="flex-initial w-3/5 md:w-64 text-right">
                          <div className="relative">
                            <input
                              type="number"
                              name="shipping-fee"
                              id="shipping-fee"
                              inputMode="decimal"
                              className="block w-full rounded-lg text-gray-900 ring-1 ring-gray-300 sm:text-sm md:leading-6 h-11 px-4"
                              value={shippingFee}
                              onChange={(e) => setShippingFee(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-6 pt-2 invoice-generator__total">
                        <div className="flex-initial w-2/5 md:w-32 tx-text">
                          Total
                        </div>
                        <div className="flex-initial w-3/5 md:w-64 text-right tx-text">
                          {selectedCurrencySymbol} {invoiceTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="invoice-generator__actions m-6">
                  <button
                    type="button"
                    onClick={handleCreateInvoice}
                    disabled={isGeneratingPDF}
                    className="btn rounded-xl btn-create-invoice w-full transition duration-300 ease-in-out"
                  >Create the invoice
                    {isGeneratingPDF && (
                      <HalfCircleSpinner
                        size={18}
                        style={{
                          display: "inline-block",
                          marginLeft: "10px",
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/*PDF Invoice Template*/}
      <div id="pdf-template" style={{ display: 'none' }}>
        <table className='table main-invoice-table'>
          <tbody>
            {/*Top Row*/}
            <tr>
              <td>
                <table className="table top-row">
                  <tbody>
                    <tr>
                      <td>Invoice</td>
                      <td>
                        <div className="logo-wrap">
                          {selectedFile &&
                            <img src={URL.createObjectURL(selectedFile)} alt="Uploaded file" className="uploaded-image" />
                          }
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/*Invoice Info Section*/}
            <tr className="invoice-info-row">
              <td>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="title-txt">INVOICE NUMBER</div>
                        <div className="detail-txt">{invoiceNumber}</div>
                      </td>
                      <td>
                        <div className="title-txt">DATE OF ISSUE</div>
                        <div className="detail-txt">{invoiceDate}</div>
                      </td>
                      <td>
                        <div className="title-txt">DUE DATE</div>
                        <div className="detail-txt">{dueDate}</div>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="title-txt">BILLED TO</div>
                        <div className="detail-txt">{clientDetails}</div>
                      </td>
                      <td>
                        <div className="title-txt">FROM</div>
                        <div className="detail-txt">{companyDetails}</div>
                      </td>
                      <td>
                        <div className="title-txt">PURCHASE ORDER</div>
                        <div className="detail-txt">{purchaseOrder}</div>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/*Invoice Description Section*/}
            <tr className="invoice-description-row">
              <td>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Unit cost</th>
                      <th>QTY</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items && items.map(( item) => (
                      <tr key={item.id}>
                        <td>{item.desc}</td>
                        <td>{item.rate}</td>
                        <td>{item.qty}</td>
                        <td>{item.qty * item.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            {/*Invoice Terms Section*/}
            <tr className="invoice-terms-row">
              <td>
                <table className="table terms">
                  <tbody>
                    <tr>
                      <td>
                        {terms &&
                            <>
                                <div className="title-txt">TERMS</div>
                                <div className="detail-txt">{terms}</div>
                            </>
                        }
                      </td>
                      <td>
                        <table className="table sub-total">
                          <tbody>
                            <tr>
                              <td><div className="title-txt">SUBTOTAL</div></td>
                              <td><div className="detail-txt">{selectedCurrencySymbol} {formattedSubtotal}</div></td>
                            </tr>
                            <tr>
                              <td><div className="title-txt">DISCOUNT</div></td>
                              <td><div className="detail-txt">{selectedCurrencySymbol} -{discount}</div></td>
                            </tr>
                            <tr>
                              <td><div className="title-txt">(TAX RATE)</div></td>
                              <td><div className="detail-txt">{tax} %</div></td>
                            </tr>
                            <tr>
                              <td><div className="title-txt">TAX</div></td>
                              <td><div className="detail-txt">{selectedCurrencySymbol} {(subtotal * (taxValue / 100))}</div></td>
                            </tr>
                            <tr>
                              <td><div className="title-txt">SHIPPING</div></td>
                              <td><div className="detail-txt">{selectedCurrencySymbol} {shippingFee}</div></td>
                            </tr>
                            <tr className="invoice-total">
                              <td colSpan={2}>
                                <div className="title-txt">INVOICE TOTAL</div>
                                <div className="detail-txt">{selectedCurrencySymbol} {invoiceTotal}</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/*Invoice Bank Section*/}
            <tr className="bank-detail-row">
              <td>
                {bankDetails &&
                  <>
                    <div className="title-txt">BANK ACCOUNT DETAILS</div>
                    <div className="detail-txt">{bankDetails}</div>
                  </>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
