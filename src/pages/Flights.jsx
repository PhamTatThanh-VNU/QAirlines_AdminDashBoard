import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function Flights() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/locations/all")
      .then((response) => setFlights(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Location Name</TableCell>
            <TableCell>Airport Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
            <TableRow key= {flight.code}>
              <TableCell>{flight.code}</TableCell>
              <TableCell>{flight.locationName}</TableCell>
              <TableCell>{flight.airportName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
