import React from "react";
import {
  Stack,
  Typography,
  IconButton,
  Button,
  Box,
  Modal,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Toolbar,
  Dialog,
  Slide,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  LoadingButton,
} from "@mui/lab";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import useSWR from "swr";
import axiosClient from "lib/axiosClient";
import dayjs from "dayjs";
import { Replay, Visibility, Close } from "@mui/icons-material";
import { useState } from "react";
import CustomerForm from "pages/customer/Form";
import { useTranslation } from "react-i18next";

function objectToString(obj) {
  let result = "";

  for (const key in obj) {
    if (result.length > 0) {
      result += ", ";
    }
    result += `${key} to "${obj[key]}"`;
  }

  return result;
}

const TimelinePage = ({
  targetModel,
  targetId,
  renderRow,
  SnapshotForm,
}: {
  targetModel: string;
  targetId: string;
  renderRow?: (item: any, index: number) => React.ReactNode;
  SnapshotForm?: React.ComponentType<{ [key: string]: any }>;
}) => {
  const { t } = useTranslation();
  const { data: { items } = { items: [] }, isLoading } = useSWR(
    `/api/audit-log/${targetModel}/${targetId}`,
    (url) => axiosClient.get(url).then((res) => res.data)
  );
  const [open, setOpen] = useState(false);
  const [snapshot, setSnapshot] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const handleResetButtonClick = (data) => {
    setSnapshot(data);
    setOpen(true);
  };

  const defaultRecord = (item, index) => {
    const { user, action, createdAt, data } = item;
    return (
      <Stack
        key={item.id}
        spacing={1}
        direction="row"
        sx={{
          fontSize: "16px",
        }}
      >
        <Typography variant="body1" component={"span"}>
          {user.first_name + " " + user.last_name}
        </Typography>
        <Typography variant="body1" component={"span"}>
          {action}
        </Typography>
        <Typography variant="body1" component={"span"}>
          {`on ${dayjs(createdAt).format("YYYY-MM-DD HH:mm")}`}
        </Typography>
        {SnapshotForm && (
          <IconButton
            size={"small"}
            onClick={() => handleResetButtonClick(data)}
          >
            <Visibility
              sx={{
                width: "16px",
                height: "16px",
              }}
            />
          </IconButton>
        )}
      </Stack>
    );
  };

  const getRecord = (item, index) => {
    if (typeof renderRow === "function") {
      const record = renderRow(item, index);
      if (record) {
        return record;
      }
    }

    return defaultRecord(item, index);
  };

  return (
    <Stack>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {isLoading && (
          <TimelineItem
            sx={{
              minHeight: "48px",
            }}
          >
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
              <Skeleton />
            </TimelineContent>
          </TimelineItem>
        )}
        {items.map((item, index) => {
          return (
            <TimelineItem
              key={item.id}
              sx={{
                minHeight: "48px",
              }}
            >
              <TimelineSeparator>
                <TimelineDot />
                {index !== items.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>{getRecord(item, index)}</TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
      <Dialog open={open} onClose={handleClose} fullScreen>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("snapshot")}
          </Typography>
        </Toolbar>
        <Stack padding={3}>
          <SnapshotForm snapshot={snapshot} />
        </Stack>
      </Dialog>
    </Stack>
  );
};

export default TimelinePage;
