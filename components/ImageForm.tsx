import {
  Button,
  Grid,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Delete, ExpandMore } from "@mui/icons-material";
import deepEqual from "deep-equal";
import colors from "theme/colors";
import cuid from "cuid";
import { array, object, string, number } from "yup";
import Image from "next/image";

export const imageSchema = object({
  id: string().required(),
  order: number().integer().required(),
  url: string().required(),
  name: string().required(),
});

export type imageType = ReturnType<typeof imageSchema["cast"]>;

const ImageForm = ({ multiple = true }) => {
  const { t } = useTranslation();
  const { control, register, formState } = useFormContext();
  const images = useFieldArray({
    name: "images",
    control,
  });

  return (
    <Stack direction={"row"} spacing={1}>
      {images.fields.map((image: imageType) => {
        return (
          <Stack
            key={image.id}
            sx={{
              height: "200px",
              width: "200px",
            }}
          >
            <Image
              src={image.url}
              alt={image.name}
              height={"200px"}
              width={"200px"}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ImageForm;
