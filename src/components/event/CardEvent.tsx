import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { EventType } from "../../types";

const CardEvent = ({ event }: { event: EventType }) => (
  <Box sx={{ minWidth: 200 }}>
    <Card variant="outlined">
      <CardContent className="cursor-default">
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {event.createdAt.toDate().getFullYear()}
        </Typography>
        <Tooltip title={event.name}>
          <Typography
            variant="body1"
            component="div"
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
            color="text.secondary"
          >
            {event.organizer}
          </Typography>
        </Tooltip>
        <Tooltip title={event.level}>
          <Typography
            variant="subtitle2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
            color="text.secondary"
          >
            {event.level}
          </Typography>
        </Tooltip>
      </CardContent>
      <CardActions>
        <Link href={`event/rekap-juri/${event.eventID}`} passHref>
          <Button size="small">Rekap Juri</Button>
        </Link>
      </CardActions>
    </Card>
  </Box>
);

export default CardEvent;
