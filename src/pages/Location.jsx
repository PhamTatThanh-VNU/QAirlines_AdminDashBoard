import React, { useState, useEffect } from "react";
import {
  fetchLocations,
  addLocation,
  deleteLocation,
  updateLocation
} from "../services";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Box,
  InputAdornment,
  Typography
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon
} from "@mui/icons-material";

export default function Location() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState({
    fetching: false,
    saving: false,
    deleting: false
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, fetching: true }));
        const locationData = await fetchLocations();
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, fetching: false }));
      }
    };

    fetchData();
  }, []);

  const handleShowAlert = (message, severity) => {
    setErrorMessage("");
    setSuccessMessage(message);
    setAlertSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    code: "",
    locationName: "",
    airportName: ""
  });

  const handleOpenDialog = (location = null) => {
    if (location) {
      setCurrentLocation(location);
      setIsEditing(true);
    } else {
      setCurrentLocation({
        code: "",
        locationName: "",
        airportName: ""
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLocation((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveLocation = async () => {
    if (!currentLocation.code || !currentLocation.locationName || !currentLocation.airportName) {
      setErrorMessage("Please fill all fields.");
      return;
    }
    try {
      setIsLoading((prev) => ({ ...prev, saving: true }));
      if (isEditing) {
        setLocations((prev) =>
          prev.map((loc) => (loc.id === currentLocation.id ? currentLocation : loc))
        );
        await updateLocation(currentLocation.id, currentLocation);
        handleCloseDialog();
        handleShowAlert("Location updated successfully", "success");
      } else {
        const newLocation = await addLocation(currentLocation);
        setLocations((prev) => [...prev, newLocation]);
        handleCloseDialog();
        handleShowAlert("New location added successfully", "success");
      }
    } catch (error) {
      handleShowAlert("Error saving location: " + error.message, "error");
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      setIsLoading((prev) => ({ ...prev, deleting: true, deletingId: locationId }));
      await deleteLocation(locationId);
      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      handleShowAlert("Location deleted successfully", "success");
    } catch (error) {
      handleShowAlert(
        "Error deleting location. Ensure related flights are deleted first.",
        "error"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, deleting: false, deletingId: null }));
    }
  };

  const filteredLocations = locations.filter((location) =>
    location.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
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
            Quản lí vị trí các sân bay 
          </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        
        <TextField
          placeholder="Search Locations"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Location
        </Button>
      </Box>

      {isLoading.fetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Location Name</TableCell>
                <TableCell>Airport Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow
                  key={location.code}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{location.code}</TableCell>
                  <TableCell>{location.locationName}</TableCell>
                  <TableCell>{location.airportName}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(location)}
                      disabled={isLoading.deleting}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteLocation(location.id)}
                      disabled={isLoading.deleting || isLoading.fetching}
                    >
                      {isLoading.deleting && isLoading.deletingId === location.id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit Location" : "Add Location"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="code"
            label="Location Code"
            fullWidth
            variant="outlined"
            value={currentLocation.code}
            onChange={handleInputChange}
            error={!!errorMessage}
            helperText={errorMessage && "This field is required"}
          />
          <TextField
            margin="dense"
            name="locationName"
            label="Location Name"
            fullWidth
            variant="outlined"
            value={currentLocation.locationName}
            onChange={handleInputChange}
            error={!!errorMessage}
            helperText={errorMessage && "This field is required"}
          />
          <TextField
            margin="dense"
            name="airportName"
            label="Airport Name"
            fullWidth
            variant="outlined"
            value={currentLocation.airportName}
            onChange={handleInputChange}
            error={!!errorMessage}
            helperText={errorMessage && "This field is required"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="text">
            Cancel
          </Button>
          <Button
            onClick={handleSaveLocation}
            variant="contained"
            color="primary"
            disabled={isLoading.saving}
          >
            {isLoading.saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditing ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
