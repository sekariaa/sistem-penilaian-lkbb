import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";

interface Event {
  name: string;
  createdAt: Date;
  organizer: string;
}

const CardEvent = ({ event }: { event: Event }) => (
  <Box sx={{ maxWidth: 200 }}>
    <Card variant="outlined">
      <CardContent className="cursor-default">
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {event.createdAt.getFullYear()}
        </Typography>
        <Tooltip title={event.name}>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {event.name}
          </Typography>
        </Tooltip>
        <Tooltip title={event.organizer}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {event.organizer}
          </Typography>
        </Tooltip>
      </CardContent>
      <CardActions>
        <Button size="small">Rekap Nilai</Button>
      </CardActions>
    </Card>
  </Box>
);

export default CardEvent;
