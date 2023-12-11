import React from 'react';
import Select, { Styles } from 'react-select';
import { v4 as uuidv4 } from 'uuid';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  countryKeywords: string[];
  supportsDecimals: boolean;
}

interface CurrencyDropdownProps {
  selectedCurrency: string;
  onChange: (currency: string, code: string, symbol: string) => void;
  currencies: Currency[];
}

const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    border: '1px solid #d8d8db',
    borderRadius: '8px',
    minHeight: '44px',
    width: '100%',
    '&:hover': {
      borderColor: '#d8d8db',
      cursor: 'pointer',
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#0e0f0c',
    border: '0',
    borderColor: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#202a37' : 'white',
    color: state.isSelected ? '#fff' : '#0e0f0c',
    transition: 'all .35s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? '#202a37' : '#eee',
    },
  }),
};

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ selectedCurrency, onChange, currencies }) => {
  const selectedOption = currencies.find((currency) => currency.code === selectedCurrency);
  const selectedLabel = selectedOption ? `${selectedOption.name} (${selectedOption.code})` : '';
  const uniqueId = uuidv4();

  const options = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
    code: currency.code,
    symbol: currency.symbol,
  }));

  return (
    <Select
      id={`currency-${uniqueId}`}
      name="currency"
      autoComplete="country-name"
      className="select select-md w-full p-0"
      value={{ value: selectedCurrency, label: selectedLabel }}
      options={options}
      onChange={(selectedOption: { value: string, code: string, symbol: string }) =>
        onChange(selectedOption.value, selectedOption.code, selectedOption.symbol)
      }
      styles={customStyles}
      placeholder="Select a currency"
    />
  );
};

export default CurrencyDropdown;
