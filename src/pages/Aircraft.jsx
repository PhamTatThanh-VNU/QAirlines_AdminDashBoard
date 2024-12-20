import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight as FlightIcon
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  getAllAirCrafts,
  addAirCraft,
  updateAirCraft,
  deleteAirCraft
} from '../services';
import styles from './CSS/Style';

// const styles = {
//   gradientBackground: {
//     background: 'rgba(108, 204, 171, 0.67)', // Sử dụng màu xanh lam nhạt làm gradient
//     color: '#ffffff',
//     borderRadius: '10px',
//     padding: '24px',
//     marginBottom: '24px',
//   },
//   tableContainer: {
//     background: '#ffffff',
//     borderRadius: '10px',
//     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//     overflow: 'hidden',
//   },
//   tableHeader: {
//     background: 'rgba(108, 204, 171, 0.67)', // Gradient nhẹ nhàng hơn với các sắc độ của màu chủ đề
//     '& .MuiTableCell-head': {
//       color: '#ffffff',
//       fontWeight: 'bold',
//       fontSize: '1rem',
//     },
//   },
//   actionButton: {
//     borderRadius: '5px',
//     textTransform: 'uppercase',
//     padding: '8px 24px',
//     fontWeight: 'bold',
//     boxShadow: 'none',
//     transition: 'all 0.3s ease',
//     backgroundColor: '#8DD3BA',
//     '&:hover': {
//       backgroundColor: '#7BC4A7',
//     },
//   },
//   searchField: {
//     background: 'whitesmoke',
//     border: '1px solid #e0e0e0',
//     borderRadius: '5px',
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: 'transparent',
//       },
//       '&:hover fieldset': {
//         borderColor: '#7BC4A7', // Màu nhạt hơn khi hover
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#7BC4A7', // Màu khi focused
//       },
//     },
//   },
//   searchIcon: {
//     color: 'rgba(0, 0, 0, 0.54)',
//   },
//   dialogTitle: {
//     background: 'rgba(108, 204, 171, 0.67)', // Sử dụng gradient cho dialog title
//     color: '#ffffff',
//     padding: '16px 24px',
//   },
//   dialogContent: {
//     padding: '24px',
//   },
//   tableRow: {
//     '&:hover': {
//       background: 'rgba(142, 211, 186, 0.1)', // Màu nhạt của chủ đề khi hover trên table row
//     },
//   },
//   iconButton: {
//     borderRadius: '50%',
//     padding: '8px',
//     '&:hover': {
//       background: 'rgba(118, 128, 124, 0.2)', // Background nhẹ khi hover
//     },
//   },
// };

const Aircraft = () => {
  // State for aircraft data and management
  const [aircrafts, setAircrafts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAircraft, setCurrentAircraft] = useState({
    id: null,
    aircraftCode: '',
    manufacturer: '',
    model: '',
    businessCapacity: '',
    economyCapacity: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Loading states
  const [isLoading, setIsLoading] = useState({
    fetching: false,
    saving: false,
    deleting: false
  });

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Search state
  const [searchAircraftCode, setSearchAircraftCode] = useState('');

  // Fetch aircrafts on component mount
  useEffect(() => {
    fetchAircrafts();
  }, []);

  // Fetch all aircrafts
  const fetchAircrafts = async () => {
    setIsLoading(prev => ({ ...prev, fetching: true }));
    try {
      const data = await getAllAirCrafts();
      setAircrafts(data);
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, fetching: false }));
    }
  };

  // Handle error and success notifications
  const handleError = (message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Open dialog for adding/editing
  const handleOpenDialog = (aircraft = null) => {
    if (aircraft) {
      // Editing existing aircraft
      setCurrentAircraft(aircraft);
      setIsEditing(true);
    } else {
      // Adding new aircraft
      setCurrentAircraft({
        id: null,
        aircraftCode: '',
        manufacturer: '',
        model: '',
        economyCapacity: '',
        businessCapacity: ''
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAircraft(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save aircraft (add or edit)
  const handleSaveAircraft = async () => {
    const { aircraftCode, manufacturer, model, economyCapacity, businessCapacity } = currentAircraft;
    if (!aircraftCode || !manufacturer || !model || !economyCapacity || !businessCapacity) {
      handleError('Please fill in all the fields before saving.', 'error');
      return;
    }
    setIsLoading(prev => ({ ...prev, saving: true }));
    try {
      if (isEditing) {
        // Update existing aircraft
        const updatedAircraft = await updateAirCraft(currentAircraft.id, currentAircraft);
        setAircrafts(prev =>
          prev.map(aircraft =>
            aircraft.id === currentAircraft.id ? updatedAircraft : aircraft
          )
        );
        handleError('Aircraft updated successfully', 'success');
      } else {
        // Add new aircraft
        const newAircraft = await addAirCraft(currentAircraft);
        setAircrafts(prev => [...prev, newAircraft]);
        handleError('Aircraft added successfully', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsLoading(prev => ({ ...prev, saving: false }));
    }
  };

  // Delete aircraft
  const handleDeleteAircraft = async (id) => {
    setIsLoading(prev => ({
      ...prev,
      deleting: true,
      deletingId: id
    }));
    try {
      await deleteAirCraft(id);
      setAircrafts(prev => prev.filter(aircraft => aircraft.id !== id));
      handleError('Aircraft deleted successfully', 'success');
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsLoading(prev => ({
        ...prev,
        deleting: false,
        deletingId: null
      }));
    }
  };

  // Filtered aircrafts based on search
  const filteredAircrafts = aircrafts.filter(aircraft =>
    aircraft.aircraftCode.toLowerCase().includes(searchAircraftCode.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: '#f5f5f5' }}>
      {isLoading.fetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>
          {/* Header Section */}
          <Box
            sx={{
              ...styles.boxBackground,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FlightIcon sx={{ fontSize: 40, mr: 2, color: 'white' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold !important' }}>
                Aircraft Management
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, textAlign: 'center' }}>
              More efficient and easier vehicle management
            </Typography>
          </Box>


          {/* Search and Add Section */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <TextField
              placeholder="Search aircraft code..."
              variant="outlined"
              size="medium"
              value={searchAircraftCode}
              onChange={(e) => setSearchAircraftCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ ...styles.searchIcon }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...styles.searchField, flexGrow: 1, maxWidth: '500px' }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                ...styles.actionButton,
              }}
            >
              Add New Aircraft
            </Button>
          </Box>

          {/* Table Section */}
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table>
              <TableHead sx={styles.tableHeader}>
                <TableRow>
                  <TableCell>Aircraft Code</TableCell>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell>Model Number</TableCell>
                  <TableCell>Business Capacity</TableCell>
                  <TableCell>Economy Capacity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredAircrafts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredAircrafts
                ).map((aircraft) => (
                  <TableRow key={aircraft.id} sx={styles.tableRow}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {aircraft.aircraftCode}
                    </TableCell>
                    <TableCell>{aircraft.manufacturer}</TableCell>
                    <TableCell>{aircraft.model}</TableCell>
                    <TableCell>{aircraft.businessCapacity}</TableCell>
                    <TableCell>{aircraft.economyCapacity}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpenDialog(aircraft)}
                        sx={{ ...styles.iconButton, color: '#1976d2' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteAircraft(aircraft.id)}
                        sx={{ ...styles.iconButton, color: '#d32f2f', ml: 1 }}
                      >
                        {isLoading.deleting && isLoading.deletingId === aircraft.id ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAircrafts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="textSecondary">
                        No aircraft found matching "{searchAircraftCode}"
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              component="div"
              count={filteredAircrafts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
              }}
            />
          </TableContainer>

          {/* Dialog */}
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '16px',
                overflow: 'hidden',
              },
            }}
          >
            <DialogTitle sx={styles.dialogTitle}>
              {isEditing ? 'Edit Aircraft' : 'Add New Aircraft'}
            </DialogTitle>
            <DialogContent sx={styles.dialogContent}>
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1fr', mt: 2 }}>
                <TextField
                  label="Aircraft Code"
                  name="aircraftCode"
                  value={currentAircraft.aircraftCode}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={styles.searchField}
                />
                <TextField
                  label="Manufacturer"
                  name="manufacturer"
                  value={currentAircraft.manufacturer}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={styles.searchField}
                />
                <TextField
                  label="Model Number"
                  name="model"
                  value={currentAircraft.model}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={styles.searchField}
                />
                <TextField
                  label="Business Capacity"
                  name="businessCapacity"
                  type="number"
                  value={currentAircraft.businessCapacity}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={styles.searchField}
                />
                <TextField
                  label="Economy Capacity"
                  name="economyCapacity"
                  type="number"
                  value={currentAircraft.economyCapacity}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={styles.searchField}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  ...styles.actionButton,
                  color: '#ffffff',
                  border: 'none',
                  background: 'rgba(241, 116, 116, 0.84)',
                  '&:hover': {
                    background: 'rgba(197, 32, 32, 0.87)',
                    boxShadow: 'none',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAircraft}
                variant="contained"
                disabled={isLoading.saving || !currentAircraft.aircraftCode || !currentAircraft.manufacturer || !currentAircraft.model || !currentAircraft.economyCapacity || !currentAircraft.businessCapacity}
                sx={{
                  ...styles.actionButton,
                }}
              >
                {isLoading.saving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEditing ? (
                  'Update Aircraft'
                ) : (
                  'Add Aircraft'
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              elevation={6}
              variant="filled"
              sx={{
                width: '100%',
                borderRadius: '12px',
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default Aircraft;