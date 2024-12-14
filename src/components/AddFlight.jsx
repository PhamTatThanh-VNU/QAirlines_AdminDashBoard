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
} from "@mui/material";
import axios from "axios";

export const AddFlight = ({ open, onClose, columns, onAdd, editingFlight, onEdit }) => {
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        axios
            .get("http://localhost:8080/locations/all")
            .then((response) => setLocations(response.data))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        // Cập nhật formData khi editingFlight thay đổi
        if (editingFlight) {
            setFormData(editingFlight); // Gán dữ liệu từ chuyến bay đang chỉnh sửa
        } else {
            setFormData(
                columns.reduce((acc, column) => {
                    if (column.field !== "id" && column.field !== "action") {
                        acc[column.field] = "";         // Đặt giá trị mặc định là rỗng nếu không chỉnh sửa
                    }
                    return acc;
                }, {})
            );
        }
    }, [editingFlight, columns]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFlight) {
            onEdit(formData); // Gửi dữ liệu chỉnh sửa
        } else {
            onAdd(formData); // Gửi dữ liệu thêm mới
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingFlight ? "Edit Flight" : "Add New Flight"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    {columns
                        .filter((column) => column.field !== "id" && column.field !== "action")
                        .map((column) => {
                            if (column.field === "departure" || column.field === "destination") {
                                // Nếu cột là 'departure' hoặc 'destination', render dropdown
                                return (
                                    <FormControl key={column.field} fullWidth margin="dense">
                                        <InputLabel>{column.headerName}</InputLabel>
                                        <Select
                                            label={column.headerName}
                                            name={column.field}
                                            value={formData[column.field]}
                                            onChange={handleChange}
                                        >
                                            {locations.map((location) => (
                                                <MenuItem key={location.code} value={location.locationName + " (" + location.code + ")"}>
                                                    {location.locationName + " (" + location.code + ")"}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            }

                            // nếu cột là departureDate hoặc arrivalDate, render dưới dạng TextField với type="date"
                            if (column.field === "departureDate" || column.field === "arrivalDate") {
                                return (
                                    <TextField
                                        key={column.field}
                                        label={column.headerName}
                                        type="date"
                                        name={column.field}
                                        value={formData[column.field]}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true, // Đảm bảo nhãn vẫn hiển thị đúng khi người dùng chọn ngày
                                        }}
                                    />
                                );
                            }

                            // nếu cột là status, render dưới dạng dropdown
                            if (column.field === "status") {
                                return (
                                    <FormControl key={column.field} fullWidth margin="dense">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="On-time">On-time</MenuItem>
                                            <MenuItem value="Delayed">Delayed</MenuItem>
                                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                );
                            }

                            // nếu cột là availableSeats, price, render dưới dạng TextField với type="number"
                            if (column.field === "availableSeats" || column.field === "price") {
                                return (
                                    <TextField
                                        key={column.field}
                                        label={column.headerName}
                                        type="number"
                                        name={column.field}
                                        value={formData[column.field]}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        inputProps={{ min: 0 }}
                                    />
                                );
                            }

                            // Các cột khác vẫn render dưới dạng TextField
                            return (
                                <TextField
                                    key={column.field}
                                    label={column.headerName}
                                    type={column.type || "text"}
                                    name={column.field}
                                    value={formData[column.field]}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                />
                            );
                        })}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    {editingFlight ? "Save Changes" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};