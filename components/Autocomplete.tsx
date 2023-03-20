import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, TextField, Stack, Typography } from "@mui/material";

const _Autocomplete = ({ options, name, subtitle = "" }) => {
  const { control, watch } = useFormContext();
  const value = watch(name);
  return (
    <Stack spacing={1}>
      <Typography>{subtitle}</Typography>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, ...restProps } }) => {
          return (
            <Autocomplete
              {...restProps}
              multiple
              options={options}
              value={value}
              onChange={(_, value) => {
                onChange(value);
              }}
              isOptionEqualToValue={(opt, v) => opt.value === v.value}
              filterSelectedOptions
              renderInput={(params) => {
                // return <div>1</div>;
                return (
                  <TextField
                    {...params}
                    // label="filterSelectedOptions"
                    placeholder="Add or remove"
                  />
                );
              }}
            />
          );
        }}
      />
    </Stack>
  );
};

export default _Autocomplete;
