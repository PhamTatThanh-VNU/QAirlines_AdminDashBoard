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
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon ,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { 
  getAllAirCrafts, 
  addAirCraft, 
  updateAirCraft, 
  deleteAirCraft 
} from '../services';

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
    <Box 
      sx={{ 
        width: '100%', 
        p: 3,
        background: 'linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)',
        position: 'relative'
      }}
    >
      {/* Hiển thị khi loading */}
      {isLoading.fetching ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
      </Box>
      ) : (
        <>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 3, 
              fontWeight: 'bold', 
              color: '#2c3e50',
              textAlign: 'center'
            }}
          >
            Quản lí tàu bay
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
            <TextField
              label="Search by Aircraft Code"
              variant="outlined"
              size="small"
              value={searchAircraftCode}
              onChange={(e) => setSearchAircraftCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#5A9BD5' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                mr:2,
                background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#90CAF9',
                  },
                  '&:hover fieldset': {
                    borderColor: '#42A5F5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1E88E5',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#1976D2',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1E88E5',
                },
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              disabled={isLoading.fetching}
              sx={{ 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2196F3 10%, #21CBF3 70%)'
                }
              }}
            >
              Add New Aircraft
            </Button>
          </Box>

          <TableContainer 
            component={Paper} 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ background: '#f0f4f8' }}>
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
                  <TableRow 
                    key={aircraft.id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { background: 'rgba(0, 0, 0, 0.04)' },
                      opacity: isLoading.deleting && isLoading.deletingId === aircraft.id ? 0.5 : 1
                    }}
                  >            
                    <TableCell>{aircraft.aircraftCode}</TableCell>
                    <TableCell>{aircraft.manufacturer}</TableCell>
                    <TableCell>{aircraft.model}</TableCell>
                    <TableCell>{aircraft.businessCapacity}</TableCell>
                    <TableCell>{aircraft.economyCapacity}</TableCell>                                
                    <TableCell align="right">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDialog(aircraft)}
                        disabled={isLoading.deleting || isLoading.fetching}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteAircraft(aircraft.id)}
                        disabled={isLoading.deleting || isLoading.fetching}
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
                    <TableCell colSpan={5} align="center">
                      No aircrafts found matching "{searchAircraftCode}"
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
              />
          </TableContainer>
        </>
      )}

      {/* Dialog for Add/Edit Aircraft */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Aircraft' : 'Add New Aircraft'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr', mt: 1 }}>
            <TextField
              margin="dense"
              name="aircraftCode"
              label="Aircraft Code"
              fullWidth
              variant="outlined"
              value={currentAircraft.aircraftCode}
              onChange={handleInputChange}
              disabled={isLoading.saving}
            />
            <TextField
              margin="dense"
              name="manufacturer"
              label="Manufacturer"
              fullWidth
              variant="outlined"
              value={currentAircraft.manufacturer}
              onChange={handleInputChange}
              disabled={isLoading.saving}
            />
            <TextField
              margin="dense"
              name="model"
              label="Model Number"
              fullWidth
              variant="outlined"
              value={currentAircraft.model}
              onChange={handleInputChange}
              disabled={isLoading.saving}
            />
            <TextField
              margin="dense"
              name="businessCapacity"
              label="Business Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={currentAircraft.businessCapacity}
              onChange={handleInputChange}
              disabled={isLoading.saving}
            />
            <TextField
              margin="dense"
              name="economyCapacity"
              label="Economy Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={currentAircraft.economyCapacity}
              onChange={handleInputChange}
              disabled={isLoading.saving}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="secondary"
            disabled={isLoading.saving}
          >
            Cancel
          </Button>
          <Button 
          onClick={handleSaveAircraft} 
          color="primary" 
          variant="contained"
          disabled={isLoading.saving || !currentAircraft.aircraftCode || !currentAircraft.manufacturer || !currentAircraft.model || !currentAircraft.economyCapacity || !currentAircraft.businessCapacity}
          >
            {isLoading.saving ? <CircularProgress size={24} color="inherit" /> : (isEditing ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Aircraft;
