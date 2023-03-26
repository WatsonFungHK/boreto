import { Stack, Typography } from "@mui/material";
import { addressScehma } from "./AddressForm";

export const formatAddress = (address: addressScehma) => {
  const { line_1, line_2, line_3, city, state, country, postal_code } = address;
  const addressText = [
    line_1,
    line_2,
    line_3,
    city,
    state,
    country,
    postal_code,
  ].filter((value) => {
    return typeof value === "string" && value.length > 0;
  });

  return addressText.join(",\n");
};

const AddressDisplay = ({ address = {} }: { address: addressScehma }) => {
  const { line_1, line_2, line_3, city, state, country, postal_code } = address;
  const addressText = [
    line_1,
    line_2,
    line_3,
    city,
    state,
    country,
    postal_code,
  ].filter((value) => {
    return typeof value === "string" && value.length > 0;
  });
  return (
    <Stack
      gap={0.5}
      sx={{
        fontSize: "12px",
      }}
    >
      {addressText.map((line) => (
        <Typography
          key={line}
          sx={{
            textDecoration: "underline",
          }}
        >
          {line}
        </Typography>
      ))}
    </Stack>
  );
};

export default AddressDisplay;
