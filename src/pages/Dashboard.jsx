import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Stack,
} from '@mui/material';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { LoadingState } from '../components';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { fetchAllBookings } from '../services/BookingServices';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchAllBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  // Tính toán thống kê
  const totalRevenue = bookings.reduce((sum, booking) =>
    sum + booking.price * booking.totalPeople, 0
  );

  const totalPassengers = bookings.reduce((sum, booking) =>
    sum + booking.totalPeople, 0
  );

  // Thống kê theo tuyến bay
  const routeStats = bookings.reduce((acc, booking) => {
    const route = `${booking.originCode}-${booking.destinationCode}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});

  // Thống kê theo hạng vé
  const classStats = bookings.reduce((acc, booking) => {
    acc[booking.ticketClass] = (acc[booking.ticketClass] || 0) + booking.totalPeople;
    return acc;
  }, {});

  const totalBookingsByClass = Object.values(classStats).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LoadingState />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoneyIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5">
                    {new Intl.NumberFormat('en-EN', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(totalRevenue)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <PeopleIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Passengers
                  </Typography>
                  <Typography variant="h5">
                    {totalPassengers}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AirplaneTicketIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Bookings
                  </Typography>
                  <Typography variant="h5">
                    {bookings.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Route Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribution by flight routes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Flight Route</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Proportion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(routeStats).map(([route, count]) => (
                    <TableRow key={route}>
                      <TableCell>{route}</TableCell>
                      <TableCell align="right">{count}</TableCell>
                      <TableCell align="right">
                        {((count / bookings.length) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Class Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribution by ticket class
            </Typography>
            <Stack spacing={2}>
              {Object.entries(classStats).map(([className, count]) => (
                <Box key={className}>
                  <Typography variant="body2" color="textSecondary">
                    {className}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(count / totalBookingsByClass) * 100}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: '#eee',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: className === 'Business' ? '#2196f3' : '#4caf50',
                          },
                        }}
                      />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="textSecondary">
                        {`${(count / totalBookingsByClass * 100).toFixed(1)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Booking Number</TableCell>
                    <TableCell>Passenger</TableCell>
                    <TableCell>Flight Route</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell align="right">Number of people</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.slice(-5).map((booking) => (
                    <TableRow key={booking.bookingId}>
                      <TableCell>{booking.bookingNumber}</TableCell>
                      <TableCell>{booking.passengerName}</TableCell>
                      <TableCell>{`${booking.originCode} → ${booking.destinationCode}`}</TableCell>
                      <TableCell>{booking.ticketClass}</TableCell>
                      <TableCell align="right">{booking.totalPeople}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('en-EN', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(booking.price * booking.totalPeople)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;