import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";

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
                    const { line_1, line_2, line_3, city, state, country } =
                      address;
                    return (
                      <FormControlLabel
                        key={address.id}
                        value={address.id.toString()}
                        control={<Radio />}
                        label={
                          <Stack
                            gap={1}
                            sx={{
                              padding: "8px 16px 0px",
                              fontSize: "12px",
                            }}
                          >
                            {line_1 && <Typography>{line_1}</Typography>}
                            {line_2 && <Typography>{line_2}</Typography>}
                            {line_3 && <Typography>{line_3}</Typography>}
                            {city && <Typography>{city}</Typography>}
                            {state && <Typography>{state}</Typography>}
                            {country && <Typography>{country}</Typography>}
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
