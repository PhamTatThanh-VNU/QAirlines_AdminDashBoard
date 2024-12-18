import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Table,
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent, 
  DialogActions,
  TablePagination,
  Fade,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  FlightTakeoff,
  Delete as DeleteIcon,
  Filter as FilterListIcon,
  AirplaneTicket,
  NoLuggage
} from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { blue, teal, grey } from '@mui/material/colors';

import { fetchAllBookings, confirmBooking,deleteCancelledBookings, handleCancelBooking } from '../services';

const theme = createTheme({
  palette: {
    primary: {
      main: teal[600],
      light: teal[100],
    },
    secondary: {
      main: blue[600], 
    },
    background: {
      default: grey[100],
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease-in-out',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: alpha(teal[600], 0.1),
          color: teal[800],
          fontWeight: 700,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap'
        },
        root: {
          padding: '16px',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600
        }
      }
    }
  }
});

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState({
    fetching: false,
    deletingCancelled: false,
    cancelBooking: false,
    accepting: false
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [processingBooking, setProcessingBooking] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = bookings.filter(booking => 
        booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
      setPage(0);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, bookings]);

  const loadBookings = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetching: true }));
      setError(null);
      const data = await fetchAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      console.error("Error fetching bookings:", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, fetching: false }));
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      setProcessingBooking(id);
      setLoading((prev) => ({ ...prev, accepting: true }));
      await confirmBooking(id);
      await loadBookings();
    } catch (error) {
      console.error("Error confirming booking:", error.message);
    } finally {
      setProcessingBooking(null);
      setLoading((prev) => ({ ...prev, accepting: false }));
    }
  };
    const cancelBooking = async (id) => {
    try {
    setProcessingBooking(id);
      setLoading((prev) => ({ ...prev, cancelBooking: true }));
      await handleCancelBooking(id);
      await loadBookings();
    } catch (error) {
      console.error("Error confirming booking:", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, cancelBooking: false }));
    setProcessingBooking(null);
    }
  };
  const handleDelete = async (filter) => {
    try {
      if(filter === 'cancelled'){
        setLoading((prev) => ({ ...prev, deletingCancelled: true }));
        await deleteCancelledBookings()
        await loadBookings()
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      setError("Không thể xóa dữ liệu. Vui lòng thử lại sau.");
      console.error("Error deleting bookings:", error.message);
    } finally {
      setLoading((prev) => ({ ...prev, deletingCancelled: false }));
      setDeleteDialogOpen(false)
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'success';
      default: return 'default';
    }
  };

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          padding: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        <Paper 
          elevation={12} 
          sx={{ 
            borderRadius: 4,
            padding: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            maxWidth: 1400,
            backgroundColor: 'rgba(255,255,255,0.98)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: 24
            }
          }}
        >
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(to right, ${teal[500]}, ${blue[500]})`
            }}
          />

          <Typography 
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 800,
              color: teal[800],
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <AirplaneTicket fontSize="large" />
            Quản Lý Đặt Vé
          </Typography>

            <Box 
                sx={{ 
                        mb: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' }
                    }}
                    >
                    <Box sx={{ flex: 1 }}>
                        <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Tìm kiếm theo tên khách hàng, mã đặt vé hoặc số hiệu chuyến bay..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                            ),
                            sx: {
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: alpha(teal[500], 0.04)
                            }
                            }
                        }}
                        />
                    </Box>
                    
                    <Box 
                        sx={{ 
                        display: 'flex',
                        gap: 1,
                        justifyContent: { xs: 'flex-end', md: 'flex-end' }
                        }}
                    >
                        <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        sx={{ 
                            minWidth: 130,
                            borderRadius: 2,
                            borderWidth: 2,
                            '&:hover': {
                            borderWidth: 2,
                            backgroundColor: alpha('#f44336', 0.04)
                            }
                        }}
                        >
                        Xóa Vé Cũ
                        </Button>
                    </Box>
            </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {loading.fetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                color: grey[600]
              }}
            >
              <NoLuggage sx={{ fontSize: 60, mb: 2, color: grey[400] }} />
              <Typography variant="h6">
                Không tìm thấy đơn đặt vé nào
              </Typography>
              <Typography variant="body2">
                Thử tìm kiếm với từ khóa khác
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {[
                        'Mã Đặt Vé',
                        'Hành Khách',
                        'Chuyến Bay',
                        'Điểm Đi',
                        'Điểm Đến',
                        'Khởi Hành',
                        'Trạng Thái',
                        'Thao Tác'
                      ].map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedBookings.map((booking) => (
                      <TableRow
                        key={booking.bookingId}
                        hover
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: alpha(blue[500], 0.05),
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        <TableCell>{booking.bookingNumber}</TableCell>
                        <TableCell>{booking.passengerName}</TableCell>
                        <TableCell>{booking.flightNumber}</TableCell>
                        <TableCell>{booking.originName}</TableCell>
                        <TableCell>{booking.destinationName}</TableCell>
                        <TableCell>
                          {new Date(booking.departureTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => setSelectedBooking(booking)}
                            >
                              Chi Tiết
                            </Button>
                            {booking.status === 'PENDING' && (
                                    <>
                                        <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        startIcon={
                                            processingBooking === booking.bookingId && loading.accepting? 
                                            <CircularProgress size={20} color="inherit" /> : 
                                            <CheckIcon />
                                        }
                                        onClick={() => handleConfirmBooking(booking.bookingId)}
                                        disabled={processingBooking === booking.bookingId && loading.accepting}
                                        >
                                        Xác Nhận
                                        </Button>

                                        <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        startIcon={  processingBooking === booking.bookingId && loading.cancelBooking ? 
                                            <CircularProgress size={20} color="inherit" /> : 
                                            <CancelIcon />
                                        }
                                        onClick={() => cancelBooking(booking.bookingId)}
                                        disabled={processingBooking === booking.bookingId && loading.cancelBooking}
                                        style={{ marginLeft: 8 }} // Để các nút cách nhau một chút
                                        >
                                        Hủy Vé
                                        </Button>
                                    </>
                                    )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredBookings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '.MuiTablePagination-toolbar': {
                    borderRadius: 2,
                    backgroundColor: alpha(teal[500], 0.04),
                    padding: '8px 16px'
                  }
                }}
              />
            </>
          )}
        </Paper>

        <Dialog
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          {selectedBooking && (
            <>
              <DialogTitle 
                sx={{ 
                  backgroundColor: alpha(teal[500], 0.1),
                  color: teal[800],
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <FlightTakeoff />
                Chi Tiết Đơn Đặt: {selectedBooking.bookingNumber}
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                    py: 1
                  }}
                >
                  <Typography><strong>Hành Khách:</strong> {selectedBooking.passengerName}</Typography>
                  <Typography><strong>Email:</strong> {selectedBooking.email || 'Không có'}</Typography>
                  <Typography><strong>Số Điện Thoại:</strong> {selectedBooking.phoneNumber || 'Không có'}</Typography>
                  <Typography><strong>Số Hiệu Chuyến Bay:</strong> {selectedBooking.flightNumber}</Typography>
                  <Typography><strong>Điểm Đi:</strong> {selectedBooking.originName} ({selectedBooking.originCode})</Typography>
                  <Typography><strong>Điểm Đến:</strong> {selectedBooking.destinationName} ({selectedBooking.destinationCode})</Typography>
                  <Typography><strong>Giờ Khởi Hành:</strong> {new Date(selectedBooking.departureTime).toLocaleString()}</Typography>
                  <Typography><strong>Giờ Hạ Cánh:</strong> {new Date(selectedBooking.arrivalTime).toLocaleString()}</Typography>
                  <Typography><strong>Hạng Vé:</strong> {selectedBooking.ticketClass}</Typography>
                  <Typography><strong>Tổng Số Hành Khách:</strong> {selectedBooking.totalPeople}</Typography>
                  <Typography><strong>Giá:</strong> {selectedBooking.price.toLocaleString()} VND</Typography>
                  <Typography><strong>Trạng Thái:</strong> {selectedBooking.status}</Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ backgroundColor: alpha(teal[500], 0.1), p: 2 }}>
                <Button
                         onClick={() => window.location.href = `http://localhost:8080/pdf/${selectedBooking.pdfs}`}
                        color="primary"
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                >
                        Xem PDF
                </Button>
                <Button
                  onClick={() => setSelectedBooking(null)}
                  color="primary"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                >
                  Đóng
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
            sx: {
                borderRadius: 3,
                overflow: 'hidden'
            }
            }}
        >
    <DialogTitle 
      sx={{ 
        backgroundColor: alpha(teal[500], 0.1),
        color: teal[800],
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <FilterListIcon />
      Tùy Chọn Xóa Vé
    </DialogTitle>
    <DialogContent sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={() => handleDelete('cancelled')}
          startIcon={loading.deletingCancelled ? <CircularProgress size={24} /> : <DeleteIcon />} 
          disabled = {loading.deletingCancelled}
        >
            {loading.deletingCancelled ? "Đang Xóa..." : "Xóa Vé Đã Hủy"} 
        </Button>
      </Box>
    </DialogContent>
    <DialogActions sx={{ backgroundColor: alpha(teal[500], 0.1), p: 2 }}>
      <Button
        onClick={() => setDeleteDialogOpen(false)}
        color="primary"
        variant="contained"
        startIcon={<CloseIcon />}
      >
        Đóng
      </Button>
        </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default BookingManagement;