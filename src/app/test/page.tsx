import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getEvent } from "../../utils/event";

export default function OutlinedCard() {
  const [events, setEvents] = useState<{ name: string; createdAt: Date }[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventList = await getEvent();
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Box sx={{ maxWidth: 250 }}>
      <Card variant="outlined">
        <CardContent>
          {events.map((event, index) => (
            <div key={index}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {event.createdAt.getFullYear()}
              </Typography>
            </div>
          ))}
          {events.map((event, index) => (
            <Typography key={index} variant="h5" component="div">
              {event.name}
            </Typography>
          ))}
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            adjective
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
