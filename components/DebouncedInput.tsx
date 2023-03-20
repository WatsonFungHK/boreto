import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const DebouncedInput = ({
  onKeyUp,
  debounceTimeout,
}: {
  onKeyUp: (value: string) => void;
  debounceTimeout: number;
}) => {
  const [keyword, setKeyword] = useState("");
  const { t } = useTranslation("common");

  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleKeywordSearch = debounce((value) => {
    onKeyUp(value);
  }, 500);

  return (
    <TextField
      label={t("search")}
      variant="outlined"
      value={keyword}
      onChange={handleSearch}
      onKeyUp={() => handleKeywordSearch(keyword)}
      size="small"
    />
  );
};

export default DebouncedInput;
