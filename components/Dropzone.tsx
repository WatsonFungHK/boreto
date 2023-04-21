import { Box, Stack, styled, Typography, Icon } from "@mui/material";
import type { ChangeEvent } from "react";
import { DragEventHandler, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Close } from "@mui/icons-material";
import colors from "theme/colors";
import ImageForm from "./ImageForm";

const formatBytes = (v) => v;

const UploadZoneBox = styled("div")(
  ({ theme }) => `
    position: relative;
    border: 1px dashed ${colors.blue30};
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px;
    cursor: pointer;
`
);

const UploadZone = ({
  message,
  handleFile,
  accept,
  multiple,
  error,
}: {
  message?: string;
  handleFile: (file: File | null) => void;
  accept?: string;
  multiple?: boolean;
  error?: boolean;
}) => {
  const { t } = useTranslation();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const openFileUploader = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const clear = () => {
    uploadRef.current!.value = "";
    setFileInfo(null);
    handleFile(null);
  };

  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (accept && !validateAccept(file)) return;
      setFileInfo({
        name: file.name,
        size: formatBytes(file.size),
      });
      handleFile(file);
    }
  };

  const validateAccept = (file: File): boolean => {
    const allowed = accept!.split(",").map((v) => v.trim());
    return (
      allowed.includes(file.type) ||
      allowed.includes(file.type.split("/")[0] + "/*") ||
      allowed.includes(("." + file.name.split(".").pop()) as string)
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileInfo({
        name: file.name,
        size: formatBytes(file.size),
      });
      handleFile(file);
    }
  };

  const dropzoneBackgroundColor = useMemo(() => {
    if (error) return "red.5";
    if (isDragging) return "blue.20";
    if (fileInfo !== null) return "blue.10";
    return undefined;
  }, [error, isDragging, fileInfo]);

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      {fileInfo !== null && (
        <Close
          sx={{
            position: "absolute",
            top: "38px",
            right: "46px",
            cursor: "pointer",
            zIndex: 1,
            width: "24px",
            height: "24px",
          }}
        />
      )}
      <UploadZoneBox
        onClick={openFileUploader}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          backgroundColor: dropzoneBackgroundColor,
          borderColor: error ? "red.90" : "blue.30",
        }}
      >
        <Stack spacing="12px" alignItems="center" flexDirection="column">
          <Box
            sx={{
              height: "48px",
              width: "48px",
              backgroundColor: error
                ? "red.10"
                : fileInfo !== null
                ? "blue.30"
                : "blue.10",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "999px",
            }}
          >
            {/* <Icon
              icon="upload-cloud-01"
              size={25}
              sx={{ color: error ? "red.90" : "blue.90", display: "block" }}
            /> */}
          </Box>
          <Box maxWidth="346px">
            {fileInfo === null ? (
              <Typography
                variant="body1"
                color="darkBlue.90"
                sx={{ userSelect: "none" }}
              >
                {isDragging ? (
                  t("drop-the-file-here")
                ) : message ? (
                  message
                ) : (
                  <Trans i18nKey="drag-and-drop-or-upload">
                    Drag and drop or{" "}
                    <Typography
                      component="span"
                      variant="body1"
                      color={error ? "red.90" : "blue.90"}
                      onClick={() =>
                        uploadRef.current && uploadRef.current.click()
                      }
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      upload media file(s)
                    </Typography>
                    .
                  </Trans>
                )}
              </Typography>
            ) : (
              <Stack alignItems="center" spacing="12px">
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="darkBlue.90"
                >
                  {fileInfo.name}
                </Typography>
                <Typography variant="body1" color="gray.90">
                  {fileInfo.size}
                </Typography>
              </Stack>
            )}
          </Box>
          <ImageForm />
        </Stack>
        <input
          multiple={multiple}
          type="file"
          ref={uploadRef}
          style={{ display: "none" }}
          tabIndex={-1}
          onChange={handleChange}
          accept={accept}
        />
      </UploadZoneBox>
    </Box>
  );
};

export default UploadZone;
