import {
  Grid,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import MostSpentChart from "./MostSpentChart";
import GenderPie from "./GenderPie";

const CustomerAnalytics = () => {
  return (
    <Stack>
      <Card>
        <CardContent>
          <Typography>Customer</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MostSpentChart />
            </Grid>
            <Grid item xs={6}>
              <GenderPie />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CustomerAnalytics;
