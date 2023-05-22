import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/router";
import { getItem } from "lib/swr";
import { useRef } from "react";
import useSWR from "swr";
import Form from "../pages/product/product/Form";
import { Button, Box, Stack, Typography } from "@mui/material";
import { printPDF } from "utils/printPDF";
import Image from "next/image";

const QRPage = () => {
  const router = useRouter();
  const { data } = useSWR(
    router.query.id ? `/api/product/${router.query.id}` : null,
    getItem
  );
  const ref = useRef(null);

  return (
    <Box>
      <Button onClick={() => printPDF(ref.current, data?.name)}>Print</Button>
      <Stack
        ref={ref}
        sx={{
          padding: 2,
        }}
        spacing={2}
      >
        <Typography variant="h5">Name: {data?.name}</Typography>
        {data?.images && (
          <Stack direction={"row"}>
            {data.images.map((image) => (
              <Stack
                key={image.id}
                sx={{
                  height: "150px",
                  width: "150px",
                }}
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  width={"150px"}
                  height={"150px"}
                />
              </Stack>
            ))}
          </Stack>
        )}
        <Stack spacing={1}>
          <Typography>Description: {data?.description}</Typography>
          <Typography>Price: {data?.price}</Typography>
          <Typography>Category: {data?.category?.name}</Typography>
        </Stack>
        <QRCodeSVG
          value={
            `${window.location.origin}/products/` +
            router.query.id +
            "/edit-by-qrcode"
          }
        />
      </Stack>
    </Box>
  );
};

export default QRPage;
