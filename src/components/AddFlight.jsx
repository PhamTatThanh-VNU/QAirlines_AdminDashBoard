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
import { fetchLocations } from "../services"; 
import { getAllAirCrafts } from "../services";

export const AddFlight = ({ open, onClose, columns, onAdd, editingFlight, onEdit }) => {
    const [locations, setLocations] = useState([]);
    const [aircrafts, setAircraft] = useState([]);
    const [formData, setFormData] = useState({});
    const locationData = async () => {
            try{
                const location = await fetchLocations()
                setLocations(location)
            }
            catch(error){
                console.log(error)
            }
        }
     const aircraftData = async () =>{
            try{
                const aircraft = await getAllAirCrafts()            
                setAircraft(aircraft)
            }catch(error){
                console.log(error)
            }
        }

    useEffect(() => {
        locationData()
        aircraftData()
      } ,[]);

    useEffect(() => {
        // Cập nhật formData khi editingFlight thay đổi
        if (editingFlight) {
            setFormData({
            ...editingFlight,
            origin: editingFlight.origin ? `${editingFlight.origin.locationName} (${editingFlight.origin.code})` : "",
            destination: editingFlight.destination ? `${editingFlight.destination.locationName} (${editingFlight.destination.code})` : "",
            status: editingFlight.status ? `${editingFlight.status}` : "",
            aircraft: editingFlight.aircraft ?  `${editingFlight.aircraft.aircraftCode} (${editingFlight.aircraft.manufacturer})`.trim() : ""
            });
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
        const { name, value } = e.target;

        // Xác định danh sách cần tìm kiếm
        let lookupList = [];
        if (name === "origin" || name === "destination") {
            lookupList = locations; // Sử dụng danh sách locations cho origin/destination
        } else if (name === "aircraft") {
            lookupList = aircrafts; // Sử dụng danh sách aircrafts cho aircraft
        }

        // Tìm đối tượng tương ứng với giá trị được hiển thị
        const selectedItem = lookupList.find(
            (item) =>
                `${item.locationName || item.aircraftCode} (${item.code || item.manufacturer})` === value
        );

        // Cập nhật formData với id nếu tìm thấy, nếu không thì dùng giá trị nhập
        setFormData({
            ...formData,
            [name]: selectedItem ? selectedItem.id : value,
        });
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
                            if (column.field === "origin" || column.field === "destination") {
                                // Nếu cột là 'origin' hoặc 'destination', render dropdown
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
                                                <MenuItem key={location.id} value={location.locationName + " (" + location.code + ")"}>
                                                    {location.locationName + " (" + location.code + ")"}                                            
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            }

                            // nếu cột là departureDate hoặc arrivalDate, render dưới dạng TextField với type="date"
                            if (column.field === "departureTime" || column.field === "arrivalTime") {
                                return (
                                    <TextField
                                        key={column.field}
                                        label={column.headerName}
                                        type="datetime-local"
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
                                            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                );
                            }
                             if (column.field === "aircraft") {
                                return (
                                    <FormControl key={column.field} fullWidth margin="dense">
                                        <InputLabel>{column.headerName}</InputLabel>
                                        <Select
                                            label={column.headerName}
                                            name={column.field}
                                            value={formData[column.field]}
                                            onChange={handleChange}
                                        >
                                            {aircrafts.map((air) => (
                                                <MenuItem key={air.id}   value={`${air.aircraftCode} (${air.manufacturer})`.trim()}>
                                                        {`${air.aircraftCode} (${air.manufacturer})`}
                                                </MenuItem>
                                            ))}
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