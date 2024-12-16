import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  IconButton, 
  Snackbar, 
  Alert 
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { AddFlight } from "../components/AddFlight";
import { getAllFlights, deleteFlight } from "../services/FlightServices";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: theme.spacing(1),
  textTransform: 'none'
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
    },
  },
});

export default function Flight() {
    const [flights, setFlights] = useState([]);
    const [originCode, setOriginCode] = useState('');
    const [destinationCode, setDestinationCode] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    
    // Error State
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState({
        fetching : false,
        saving: false,
        deleting: false 
    });

    // Formatting Date
    const formatDate = (date) => {
        try {
            const [datePart, timePart] = date.split("T");  
            const [year, month, day] = datePart.split("-"); 
            const [hour, minute] = timePart.split(":"); 
        
            return `${hour}:${minute} ${day}-${month}-${year}`;
        } catch (err) {
            console.error("Date formatting error:", err);
            return "Invalid Date";
        }
    };

    // Fetch Flights with Error Handling
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading((prev) => ({ ...prev, fetching: true }));
                const flightsData = await getAllFlights();
                setFlights(flightsData);
                setError(null);
            } catch (error) {
                setError("Failed to fetch flights. Please try again.");
                console.error("Flights fetch error:", error);
            } finally {
                 setLoading((prev) => ({ ...prev, fetching: false }));
            }
        };
        fetchFlights();
    }, []);

    // Existing handlers with minor error handling
    const handleAddFlight = (newFlight) => {
        try {
            setFlights((prevFlights) => [
                ...prevFlights,
                { id: prevFlights.length + 1, ...newFlight },
            ]);
            setOpenAddDialog(false);
        } catch (error) {
            setError("Failed to add flight. Please try again.");
        }
    };

    const handleEditFlight = (index) => {
        try {
            const flightToEdit = flights[index];
            setEditingFlight(flightToEdit);
            setOpenEditDialog(true);
        } catch (error) {
            setError("Failed to edit flight. Please try again.");
        }
    };

    const handleSaveEditedFlight = (updatedFlight) => {
        try {
            setFlights((prevFlights) =>
                prevFlights.map((flight) =>
                    flight.id === updatedFlight.id ? updatedFlight : flight
                )
            );
            setOpenEditDialog(false);
        } catch (error) {
            setError("Failed to save flight details. Please try again.");
        }
    };

    const handleDeleteFlight = async (index) => {
        try {
            setLoading((prev) => ({ ...prev, deleting: true, deletingId: index }));
            await deleteFlight(index)
             setFlights((prevFlights) =>
            prevFlights.filter((flight) => flight.flightId !== index) // Cập nhật danh sách cục bộ
            );
        } catch (error) {
            setError("Failed to delete flight. Please try again.");
        }
        finally{
            setLoading((prev) => ({ ...prev, deleting: false, deletingId: null }));
        }
    };

    // Columns definition (unchanged)
    const columns = [    
        { field: "flightNumber", headerName: "Flight Number", width: 100 },
        { field: "origin", headerName: "Departure", width: 150 },
        { field: "destination", headerName: "Destination", width: 150 },
        { field: "departureTime", headerName: "Departure Date", width: 200 },
        { field: "arrivalTime", headerName: "Arrival Date", width: 200 },
        { field: "price", headerName: "Price ($)", width: 120 },
        { field: "availableSeats", headerName: "Available Seats", width: 60 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "aircraft", headerName: "Aircraft", width: 90 },
        {
            field: "action", 
            headerName: "Actions", 
            width: 100, 
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton color="primary" onClick={() => handleEditFlight(params.row.id - 1)}>
                        <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteFlight(params.row.id)} 
                        disabled = {loading.deleting && loading.deletingId === params.row.id}>
                    <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    // Rows mapping (unchanged)
    const rows = flights.map((flight) => ({
        id: flight.flightId,
        flightNumber: flight.flightNumber,
        origin: flight.origin.airportName,
        destination: flight.destination.airportName,
        departureTime: formatDate(flight.departureTime),
        arrivalTime: formatDate(flight.arrivalTime),
        price: flight.price,
        availableSeats: flight.availableSeats,
        status: flight.status,
        aircraft: flight.aircraft.aircraftCode,
    }));

    return (
        <StyledPaper>
            <Typography variant="h4" gutterBottom>
                Flights List
            </Typography>

            {/* Search and Filter Section */}
            <div style={{ marginBottom: "20px" }}>
                <StyledTextField
                    label="Origin Code"
                    variant="outlined"
                    value={originCode}
                    onChange={(e) => setOriginCode(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <StyledTextField
                    label="Destination Code"
                    variant="outlined"
                    value={destinationCode}
                    onChange={(e) => setDestinationCode(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <StyledTextField
                    label="Departure Date"
                    type="date"
                    variant="outlined"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{ marginRight: "10px" }}
                />
                <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<Search />}
                >
                    Search Flights
                </StyledButton>

                <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<Add />}
                    onClick={() => setOpenAddDialog(true)}
                >
                    Add Flight
                </StyledButton>
            </div>

            {/* Data Grid */}
            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading.fetching}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            }
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { placeholder: 'Search...', debounceMs: 400 },
                        }
                    }}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setError(null)} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* Existing Dialogs */}
            <AddFlight
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                columns={columns}
                onAdd={handleAddFlight}
            />

            <AddFlight
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                columns={columns}
                editingFlight={editingFlight}
                onEdit={handleSaveEditedFlight}
            />
        </StyledPaper>
    );
}