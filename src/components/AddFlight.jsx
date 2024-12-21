import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert
} from "@mui/material";
import { fetchLocations } from "../services";
import { getAllAirCrafts } from "../services";
import { addNewFlight, updateFlight } from "../services/FlightServices";
import styles from "../pages/CSS/Style";
export const AddFlight = ({ open, onClose, columns, onAdd, editingFlight, onEdit }) => {
    const [locations, setLocations] = useState([]);
    const [aircrafts, setAircraft] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const locationData = async () => {
        try {
            const location = await fetchLocations()
            setLocations(location)
        }
        catch (error) {
            console.log(error)
        }
    }

    const aircraftData = async () => {
        try {
            const aircraft = await getAllAirCrafts()
            setAircraft(aircraft)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        locationData()
        aircraftData()
    }, []);

    useEffect(() => {
        if (editingFlight) {
            setFormData({
                ...editingFlight,
                origin: editingFlight.origin ? `${editingFlight.origin.locationName} (${editingFlight.origin.code})` : "",
                destination: editingFlight.destination ? `${editingFlight.destination.locationName} (${editingFlight.destination.code})` : "",
                status: editingFlight.status ? `${editingFlight.status}` : "",
                aircraft: editingFlight.aircraft ? `${editingFlight.aircraft.aircraftCode} (${editingFlight.aircraft.manufacturer})`.trim() : ""
            });
        } else {
            setFormData(
                columns.reduce((acc, column) => {
                    if (column.field !== "id" && column.field !== "action") {
                        acc[column.field] = "";
                    }
                    return acc;
                }, {})
            );
        }
    }, [editingFlight, columns]);

    const validateForm = () => {
        const newErrors = {};

        // Validate Origin and Destination
        if (!formData.origin) {
            newErrors.origin = "Origin is required";
        }
        if (!formData.destination) {
            newErrors.destination = "Destination is required";
        }
        if (formData.origin === formData.destination) {
            newErrors.destination = "Destination cannot be the same as Origin";
        }

        // Validate Date Times
        const now = new Date();
        const departureTime = new Date(formData.departureTime);
        const arrivalTime = new Date(formData.arrivalTime);

        if (!formData.departureTime) {
            newErrors.departureTime = "Departure time is required";
        } else if (departureTime < now && !editingFlight) {
            newErrors.departureTime = "Departure time must be in the future";
        }

        if (!formData.arrivalTime) {
            newErrors.arrivalTime = "Arrival time is required";
        } else if (arrivalTime <= departureTime) {
            newErrors.arrivalTime = "Arrival time must be after departure time";
        }

        // Validate other required fields
        const requiredFields = [
            'flightNumber', 'price', 'availableEconomySeats',
            'availableBusinessSeats', 'status', 'aircraft'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear the specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        let lookupList = [];
        if (name === "origin" || name === "destination") {
            lookupList = locations;
        } else if (name === "aircraft") {
            lookupList = aircrafts;
        }

        const selectedItem = lookupList.find(
            (item) =>
                `${item.locationName || item.aircraftCode} (${item.aircraftCode || item.manufacturer})` === value
        );

        setFormData({
            ...formData,
            [name]: selectedItem ? `${selectedItem.locationName} (${selectedItem.code})` : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const originLocation = locations.find(loc =>
                loc.locationName + " (" + loc.code + ")" === formData.origin
            );

            const destinationLocation = locations.find(loc =>
                loc.locationName + " (" + loc.code + ")" === formData.destination
            );

            const selectedAircraft = aircrafts.find(air =>
                (air.aircraftCode + " (" + air.manufacturer + ")").trim() === formData.aircraft
            );

            const flightDTO = {
                flightId: editingFlight ? editingFlight.flightId : null,
                flightNumber: formData.flightNumber,
                origin: {
                    id: originLocation.id,
                    locationName: originLocation.locationName,
                    airportName: originLocation.airportName,
                    code: originLocation.code
                },
                destination: {
                    id: destinationLocation.id,
                    locationName: destinationLocation.locationName,
                    airportName: destinationLocation.airportName,
                    code: destinationLocation.code
                },
                departureTime: formData.departureTime,
                arrivalTime: formData.arrivalTime,
                price: parseFloat(formData.price),
                availableEconomySeats: parseInt(formData.availableEconomySeats),
                availableBusinessSeats: parseInt(formData.availableBusinessSeats),
                status: formData.status,
                aircraft: {
                    id: selectedAircraft.id,
                    aircraftCode: selectedAircraft.aircraftCode,
                    manufacturer: selectedAircraft.manufacturer,
                    model: selectedAircraft.model,
                    economyCapacity: selectedAircraft.economyCapacity,
                    businessCapacity: selectedAircraft.businessCapacity
                },
                createdAt: new Date().toISOString()
            };

            let response
            setLoading(true)
            if (editingFlight) {
                response = await updateFlight(editingFlight.flightId, flightDTO);
            } else {
                response = await addNewFlight(flightDTO);
            }

            if (editingFlight) {
                onEdit(response);
            } else {
                onAdd(response);
            }

            onClose();
        } catch (error) {
            console.error("Error adding/editing flight:", error);
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={styles.dialogTitle}>{editingFlight ? "Edit Flight" : "Add New Flight"}</DialogTitle>
            <DialogContent sx={styles.dialogContent}>
                <form onSubmit={handleSubmit}>
                    {columns
                        .filter((column) => column.field !== "id" && column.field !== "action")
                        .map((column) => {
                            if (column.field === "origin" || column.field === "destination") {
                                return (
                                    <FormControl
                                        key={column.field}
                                        fullWidth
                                        margin="dense"
                                        error={!!errors[column.field]}
                                    >
                                        <InputLabel>{column.headerName}</InputLabel>
                                        <Select
                                            label={column.headerName}
                                            name={column.field}
                                            value={formData[column.field] || ''}
                                            onChange={handleChange}
                                            sx={styles.selectField}
                                        >
                                            {locations.map((location) => (
                                                <MenuItem
                                                    key={location.id}
                                                    value={location.locationName + " (" + location.code + ")"}

                                                >
                                                    {location.locationName + " (" + location.code + ")"}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors[column.field] && (
                                            <Alert severity="error" style={{ marginTop: 8 }}>
                                                {errors[column.field]}
                                            </Alert>
                                        )}
                                    </FormControl>
                                );
                            }

                            if (column.field === "departureTime" || column.field === "arrivalTime") {
                                return (
                                    <TextField
                                        key={column.field}
                                        label={column.headerName}
                                        type="datetime-local"
                                        name={column.field}
                                        value={formData[column.field] || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={!!errors[column.field]}
                                        helperText={errors[column.field]}
                                        sx={styles.textField}
                                    />
                                );
                            }

                            if (column.field === "status") {
                                return (
                                    <FormControl
                                        key={column.field}
                                        fullWidth
                                        margin="dense"
                                        error={!!errors[column.field]}
                                        sx={styles.formControl}
                                    >
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            name="status"
                                            value={formData.status || ''}
                                            onChange={handleChange}
                                            sx={styles.selectField}
                                        >
                                            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                        </Select>
                                        {errors.status && (
                                            <Alert severity="error" style={{ marginTop: 8 }}>
                                                {errors.status}
                                            </Alert>
                                        )}
                                    </FormControl>
                                );
                            }

                            if (column.field === "aircraft") {
                                return (
                                    <FormControl
                                        key={column.field}
                                        fullWidth
                                        margin="dense"
                                        error={!!errors[column.field]}
                                    >
                                        <InputLabel>{column.headerName}</InputLabel>
                                        <Select
                                            label={column.headerName}
                                            name={column.field}
                                            value={formData[column.field] || ''}
                                            onChange={handleChange}
                                            sx={styles.selectField}
                                        >
                                            {aircrafts.map((air) => (
                                                <MenuItem
                                                    key={air.id}
                                                    value={`${air.aircraftCode} (${air.manufacturer})`.trim()}
                                                >
                                                    {`${air.aircraftCode} (${air.manufacturer})`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors[column.field] && (
                                            <Alert severity="error" style={{ marginTop: 8 }}>
                                                {errors[column.field]}
                                            </Alert>
                                        )}
                                    </FormControl>
                                );
                            }

                            if (column.field === "availableSeats" || column.field === "price") {
                                return (
                                    <TextField
                                        key={column.field}
                                        label={column.headerName}
                                        type="number"
                                        name={column.field}
                                        value={formData[column.field] || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        inputProps={{ min: 0 }}
                                        error={!!errors[column.field]}
                                        helperText={errors[column.field]}
                                        sx={styles.textField}
                                    />
                                );
                            }

                            return (
                                <TextField
                                    key={column.field}
                                    label={column.headerName}
                                    type={column.type || "text"}
                                    name={column.field}
                                    value={formData[column.field] || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    error={!!errors[column.field]}
                                    helperText={errors[column.field]}
                                    sx={styles.textField}
                                />
                            );
                        })}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}
                    sx={{
                        ...styles.actionButton,
                        color: '#ffffff',
                        border: 'none',
                        background: 'rgba(241, 116, 116, 0.84)',
                        '&:hover': {
                            background: 'rgba(197, 32, 32, 0.87)',
                            boxShadow: 'none',
                        },
                    }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={loading}
                    variant="contained"
                    sx={{
                        ...styles.actionButton,
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? "Processing..." : (editingFlight ? "Save Changes" : "Add")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};