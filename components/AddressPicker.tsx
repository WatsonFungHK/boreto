import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Stack,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";
import { formatAddress } from "./AddressDisplay";
import { ContentCopy } from "@mui/icons-material";

const AddressPicker = ({ addresses = [] }) => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  if (Array.isArray(addresses) && addresses.length > 0) {
    return (
      <Stack>
        <Typography>{t("pick-one-address")}</Typography>
        <FormControl>
          <Controller
            name="addressId"
            control={control}
            render={({ field }) => {
              return (
                <Stack
                  component={RadioGroup}
                  {...field}
                  divider={<Divider />}
                  gap={1}
                >
                  {addresses.map((address) => {
                    const text = formatAddress(address);

                    return (
                      <FormControlLabel
                        key={address.id}
                        value={address.id.toString()}
                        control={<Radio />}
                        label={
                          <Stack
                            gap={1}
                            sx={{
                              width: "100%",
                              fontSize: "12px",
                            }}
                          >
                            <TextField
                              value={text}
                              disabled
                              multiline
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <IconButton
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      navigator.clipboard.writeText(text);
                                    }}
                                    size="small"
                                  >
                                    <ContentCopy />
                                  </IconButton>
                                ),
                              }}
                            />
                          </Stack>
                        }
                      />
                    );
                  })}
                </Stack>
              );
            }}
          />
        </FormControl>
      </Stack>
    );
  } else {
    return null;
  }
};

export default AddressPicker;
