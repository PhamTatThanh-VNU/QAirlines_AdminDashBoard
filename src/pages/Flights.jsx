import React, { useState, useEffect } from "react";
import {
    Typography,
    IconButton,
    Snackbar,
    CircularProgress,
    Alert,
    Container,
    Chip,
    Button,
    Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {
    AccessTime,
    Cancel,
    CheckCircle,
    Edit,
    Delete,
    Flight as FlightIcon
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AddFlight } from "../components/AddFlight";
import { getAllFlights, deleteFlight } from "../services/FlightServices";
import styles from './CSS/Style';

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
                console.log(flightsData)
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
            headerName: "Flight No.",
            // width: 120,
            flex: 1,
            renderCell: (params) => (
                <div style={styles.flightNumberCell}>
                    <FlightIcon color="primary" />
                    {params.value}
                </div>
            )
        },
        {
            field: "origin",
            headerName: "Departure",
            flex: 1.5
        },
        {
            field: "destination",
            headerName: "Arrival",
            flex: 1.5
        },
        {
            field: "departureTime",
            headerName: "Departure Time",
            flex: 1.5
        },
        {
            field: "arrivalTime",
            headerName: "Arrival Time",
            // width: 150
            flex: 1.5
        },
        {
            field: "availableBusinessSeats",
            headerName: "Business Seat",
            // width: 150
            flex: 1.5
        },
        {
            field: "availableEconomySeats",
            headerName: "Economy Seat",
            // width: 150
            flex: 1.5
        },
        {
            field: "price",
            headerName: "Price",
            // width: 120,
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={`$${params.value}`}
                    style={styles.priceChip}
                />
            )
        },
        {
            field: "status",
            headerName: "Status",
            // width: 120,
            flex: 1.2,
            renderCell: (params) => {
                const status = params.value;
                let icon, chipColor;
                switch (status) {
                    case 'SCHEDULED':
                        chipColor = 'rgba(97, 184, 213, 0.67)';
                        icon = <AccessTime style={{ color: 'rgb(13, 159, 207)' }} />;
                        break;
                    case 'CANCELLED':
                        chipColor = 'rgba(244, 67, 54, 0.67)';
                        icon = <Cancel style={{ color: 'rgba(241, 33, 18, 0.67)' }} />;
                        break;
                    case 'COMPLETED':
                        chipColor = 'rgba(108, 204, 171, 0.67)';
                        icon = <CheckCircle style={{ color: 'rgba(6, 203, 134, 0.9)' }} />;
                        break;
                    default:
                        chipColor = 'default';
                        icon = null;
                }
                return (
                    <Chip
                        icon={icon}
                        label={status}
                        variant="outlined"
                        style={{ ...styles.statusChipBase, backgroundColor: chipColor, border: 'none', padding: '2px' }}
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
                        sx={{ ...styles.iconButton, color: '#1976d2' }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDeleteFlight(params.row.id)}
                        disabled={loading.deleting && loading.deletingId === params.row.id}
                        sx={{ ...styles.iconButton, color: '#d32f2f' }}
                    >
                        {
                            loading.deleting && loading.deletingId === params.row.id ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <Delete />
                            )
                        }
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



    return (
        <Container sx={{ marginBottom: 4 }}>
            <Box elevation={3}>
                <Box sx={styles.boxBackground}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <FlightIcon fontSize="large" /> Flight Management
                    </Typography>

                    <Typography variant="subtitle1" sx={{ opacity: 0.8, textAlign: 'center' }}>
                        Seamlessly manage flight schedules, routes, and availability
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 2,
                    px: 2
                }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        sx={{
                            backgroundColor: '#8DD3BA',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#7BC0A9',
                            },
                            height: '40px'
                        }}
                    >
                        Add Flight
                    </Button>
                </Box>
                <Box sx={{
                    ...styles.dataGridContainer,
                    marginBottom: 2,
                    ...styles.tableContainer,
                    paddingTop: '20px',
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
                                <div style={styles.noRowsOverlay}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100"
                                        height="100"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        // stroke={blue[500]}
                                        strokeWidth="1"
                                        style={{ opacity: 0.5, marginBottom: 16 }}
                                    >
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
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
                                    variant: 'outlined',
                                    size: 'medium',
                                    sx: {
                                        ...styles.searchField,
                                        flexGrow: 1,
                                        padding: '0',
                                        marginRight: '10px',
                                        maxWidth: '500px',
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.5rem',
                                            marginRight: 1.5,
                                            ...styles.searchIcon,
                                        },
                                        '& .MuiButtonBase-root': {
                                            display: 'none',
                                        },
                                    }
                                },
                                sx: {
                                    padding: '0 20px 15px 15px',
                                    '& .MuiButtonBase-root': {
                                        color: '#8DD3BA',
                                        fontWeight: '500',
                                    },
                                }
                            }
                        }}
                        checkboxSelection
                        disableRowSelectionOnClick
                        pageSizeOptions={[5, 10, 25]}
                        sx={{
                            ...styles.dataGrid,
                        }}
                    />
                </Box>
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
            </Box>
        </Container >
    );
}