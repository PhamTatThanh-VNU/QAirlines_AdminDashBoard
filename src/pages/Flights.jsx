import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Paper, 
  IconButton, 
  Snackbar, 
  CircularProgress,
  Alert,
  Container,
  Chip
} from "@mui/material";
import { 
  AccessTime, 
  Cancel, 
  CheckCircle, 
  Edit, 
  Delete, 
  Flight as FlightIcon 
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { blue, teal, grey } from '@mui/material/colors';
import { AddFlight } from "../components/AddFlight";
import { getAllFlights, deleteFlight } from "../services/FlightServices";

// Custom Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f0f4f8', // Soft blue-grey background
  borderRadius: theme.spacing(3),
  boxShadow: '0 12px 24px rgba(0,0,0,0.1)', // Enhanced shadow
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '10px',
    background: `linear-gradient(to right, ${teal[500]}, ${blue[500]})`, // Gradient header accent
  }
}));

const CustomChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: theme.spacing(1.5),
}));

export default function Flight() {
    const [flights, setFlights] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState({
        fetching: false,        
        deleting: false 
    });

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

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading((prev) => ({ ...prev, fetching: true }));
                const flightsData = await getAllFlights();
                setFlights(flightsData || []);
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
                    flight.flightId === updatedFlight.flightId ? updatedFlight : flight
                )
            );
            setOpenEditDialog(false);
        } catch (error) {
            setError("Failed to save flight details. Please try again.");
        }
    };

    const handleDeleteFlight = async (flightId) => {
        try {
            setLoading((prev) => ({ ...prev, deleting: true, deletingId: flightId }));
            await deleteFlight(flightId);
            setFlights((prevFlights) =>
                prevFlights.filter((flight) => flight.flightId !== flightId)
            );
        } catch (error) {
            setError("Failed to delete flight. Please try again.");
        } finally {
            setLoading((prev) => ({ ...prev, deleting: false, deletingId: null }));
        }
    };

    const columns = [    
        { 
            field: "flightNumber", 
            headerName: "Chuyến Bay", 
            width: 120,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FlightIcon color="primary" />
                    {params.value}
                </div>
            )
        },
        { 
            field: "origin", 
            headerName: "Điểm Đi", 
            width: 150 
        },
        { 
            field: "destination", 
            headerName: "Điểm Đến", 
            width: 150 
        },
        { 
            field: "departureTime", 
            headerName: "Khởi Hành", 
            width: 200 
        },
        { 
            field: "arrivalTime", 
            headerName: "Hạ Cánh", 
            width: 200 
        },
        { 
            field: "price", 
            headerName: "Giá Vé", 
            width: 120,
            renderCell: (params) => (
                <CustomChip 
                    label={`$${params.value}`} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                />
            )
        },
        {
            field: "status", 
            headerName: "Trạng Thái", 
            width: 120,
            renderCell: (params) => {
                const status = params.value;
                let chipColor, icon;
                switch(status) {
                    case 'SCHEDULED':
                        chipColor = 'info';
                        icon = <AccessTime />;
                        break;
                    case 'CANCELLED':
                        chipColor = 'error';
                        icon = <Cancel />;
                        break;
                    case 'COMPLETED':
                        chipColor = 'success';
                        icon = <CheckCircle />;
                        break;
                    default:
                        chipColor = 'default';
                        icon = null;
                }
                return (
                    <CustomChip 
                        icon={icon} 
                        label={status} 
                        color={chipColor} 
                        size="small" 
                        variant="outlined"
                    />
                );
            }
        },
        { field: "aircraft", headerName: "Aircraft", width: 90 },
        {
            field: "action", 
            headerName: "Actions", 
            width: 100, 
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton 
                        color="primary" 
                        onClick={() => handleEditFlight(params.row.id - 1)}
                        disabled={loading.deleting && loading.deletingId === params.row.id}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton 
                        color="secondary" 
                        onClick={() => handleDeleteFlight(params.row.id)} 
                        disabled={loading.deleting && loading.deletingId === params.row.id}
                    >
                        {loading.deleting && loading.deletingId === params.row.id ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <Delete />
                        )}                    
                    </IconButton>
                </>
            ),
        },
    ];

     const rows = flights.map((flight) => ({
        id: flight.flightId,
        flightNumber: flight.flightNumber || 'N/A',
        origin: flight.origin?.airportName || 'Unknown',
        destination: flight.destination?.airportName || 'Unknown',
        departureTime: flight.departureTime ? formatDate(flight.departureTime) : 'N/A',
        arrivalTime: flight.arrivalTime ? formatDate(flight.arrivalTime) : 'N/A',
        price: flight.price || 0,
        availableBusinessSeats: flight.availableBusinessSeats || 0,
        availableEconomySeats: flight.availableEconomySeats || 0,
        status: flight.status || 'Unknown',
        aircraft: flight.aircraft?.aircraftCode || 'N/A',
    }));

    const theme = createTheme({
        palette: {
            primary: {
                main: teal[600],
            },
            secondary: {
                main: blue[600],
            },
            background: {
                default: grey[100],
                paper: '#ffffff',
            },
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
            borderRadius: 12
        },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: teal[50],
                            color: teal[800],
                        }
                    }
                }
            }
        }
    });

    return (
        <Container maxWidth="xl">
            <StyledPaper elevation={3}>
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        mb: 3, 
                        fontWeight: 'bold', 
                        color: teal[800],
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}
                >
                    <FlightIcon fontSize="large" /> Quản Lý Chuyến Bay
                </Typography>        
                
               <ThemeProvider theme={theme}>
                <div style={{ 
                height: 600, 
                width: "100%", 
                backgroundColor: '#f4f6f8',
                padding: '16px',
                borderRadius: 12
            }}>
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
                    slots={{ 
                        toolbar: GridToolbar,
                        noRowsOverlay: () => (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: blue[500],
                                fontWeight: 500
                            }}>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="100" 
                                    height="100" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke={blue[500]} 
                                    strokeWidth="1" 
                                    style={{ opacity: 0.5, marginBottom: 16 }}
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                                No Flights Available
                            </div>
                        )
                    }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { 
                                placeholder: 'Search flights...', 
                                debounceMs: 400,
                                variant: 'outlined',
                                size: 'small',
                                sx: {
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: blue[200],
                                        },
                                        '&:hover fieldset': {
                                            borderColor: blue[400],
                                        },
                                    }
                                }
                            },
                        }
                    }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    sx={{
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: blue[50],
                            borderTop: `1px solid ${blue[100]}`,
                        }
                    }}
                />
            </div>
            </ThemeProvider>
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
        </Container>
    );
}