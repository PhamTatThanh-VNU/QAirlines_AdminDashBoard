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
  useTheme
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

// Custom styles
const styles = {
  gradientBackground: {
    background: 'linear-gradient(120deg, #1a237e 0%, #0d47a1 100%)',
    color: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  tableContainer: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tableHeader: {
    background: 'linear-gradient(90deg, #1e88e5 0%, #1976d2 100%)',
    '& .MuiTableCell-head': {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
  },
  actionButton: {
    borderRadius: '12px',
    textTransform: 'none',
    padding: '8px 24px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  searchField: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
  },
  dialogTitle: {
    background: 'linear-gradient(90deg, #1e88e5 0%, #1976d2 100%)',
    color: '#ffffff',
    padding: '16px 24px',
  },
  dialogContent: {
    padding: '24px',
  },
  tableRow: {
    '&:hover': {
      background: 'rgba(25, 118, 210, 0.08)',
    },
  },
  iconButton: {
    borderRadius: '12px',
    padding: '8px',
    '&:hover': {
      background: 'rgba(25, 118, 210, 0.1)',
    },
  },
};

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
    economyCapacity:''
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
        businessCapacity:''
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
              ...styles.gradientBackground, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center' // Căn giữa văn bản
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FlightIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Quản lí tàu bay
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              Quản lí phương tiện dễ dàng và hiệu quả hơn
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
              placeholder="Search aircraft..."
              variant="outlined"
              size="medium"
              value={searchAircraftCode}
              onChange={(e) => setSearchAircraftCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
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
                background: 'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                },
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
                  borderColor: '#1976d2',
                  color: '#1976d2',
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
                  background: 'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                  },
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