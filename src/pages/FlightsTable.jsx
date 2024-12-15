import React, { useState, useEffect } from "react";
import { Typography, Paper, Button, TextField, IconButton } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { AddFlight } from "../components/AddFlight";

import axios from "axios";

export default function FlightsTable() {
    // thêm 1 vài fake flight để test giao diện - dùng xong thì xóa
    const fakeFlights = [
        {
            id: 1,
            flightNumber: "VN123",
            departure: "Hanoi (HAN)",
            destination: "Ho Chi Minh City (SGN)",
            departureDate: "2024-12-15",
            arrivalDate: "2024-12-15",
            price: 120,
            availableSeats: 50,
            status: "On Time",
            airbus: "A321",
        },
        {
            id: 2,
            flightNumber: "VN456",
            departure: "Da Nang (DAD)",
            destination: "Hanoi (HAN)",
            departureDate: "2024-12-16",
            arrivalDate: "2024-12-16",
            price: 90,
            availableSeats: 20,
            status: "Delayed",
            airbus: "A320",
        },
        {
            id: 3,
            flightNumber: "VN789",
            departure: "Ho Chi Minh City (SGN)",
            destination: "Phu Quoc (PQC)",
            departureDate: "2024-12-17",
            arrivalDate: "2024-12-17",
            price: 75,
            availableSeats: 10,
            status: "Cancelled",
            airbus: "A319",
        },
        {
            id: 4,
            flightNumber: "VN101",
            departure: "Hanoi (HAN)",
            destination: "Da Nang (DAD)",
            departureDate: "2024-12-18",
            arrivalDate: "2024-12-18",
            price: 95,
            availableSeats: 30,
            status: "On Time",
            airbus: "A321",
        },
        {
            id: 5,
            flightNumber: "VN202",
            departure: "Ho Chi Minh City (SGN)",
            destination: "Hanoi (HAN)",
            departureDate: "2024-12-19",
            arrivalDate: "2024-12-19",
            price: 140,
            availableSeats: 25,
            status: "On Time",
            airbus: "B787",
        },
    ];

    const [flights, setFlights] = useState([]);
    const [originCode, setOriginCode] = useState('');
    const [destinationCode, setDestinationCode] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);

    // Hàm chuyển đổi ngày từ yyyy-mm-dd sang dd/mm/yyyy (nếu cần)
    const formatDate = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`; // Trả về theo định dạng dd/mm/yyyy
    };

    const fetchFlights = () => {
        // const formattedDate = formatDate(departureTime); // Chuyển đổi ngày
        axios
            .get("http://localhost:8080/flights/search", {
                params: {
                    originCode: originCode,
                    destinationCode: destinationCode,
                    departureTime: departureTime,               // Gửi ngày theo định dạng dd/mm/yyyy
                },
            })
            .then((response) => setFlights(response.data))
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setFlights([{ flightNumber: 'No flights found matching the given criteria.' }]);
                } else {
                    console.error('Error fetching flights data.', error);
                }
            });
    };

    // hàm gọi API khi originCode, destinationCode, departureTime thay đổi
    // useEffect(() => {
    //     if (originCode && destinationCode && departureTime) {
    //         fetchFlights();
    //     }
    // }, [originCode, destinationCode, departureTime]);

    // hàm test gọi bằng fakeFlights
    useEffect(() => {
        // Thay thế gọi API bằng dữ liệu fake để kiểm tra
        setFlights(fakeFlights);
    }, []);


    // Thêm chuyến bay mới
    const handleAddFlight = (newFlight) => {
        setFlights((prevFlights) => [
            ...prevFlights,
            { id: prevFlights.length + 1, ...newFlight },
        ]);
    };

    // Sửa thông tin chuyến bay
    const handleEditFlight = (index) => {
        const flightToEdit = flights[index];
        setEditingFlight(flightToEdit);
        setOpenEditDialog(true);
    };

    // Lưu thông tin chuyến bay đã chỉnh sửa vào API - phải chỉnh sửa đường link API
    const handleSaveEditedFlight = (updatedFlight) => {
        // gọi api sửa thông tin chuyến bay (nếu cần)

        /** 
        axios
            .put(`http://localhost:8080/flights/${updatedFlight.id}`, updatedFlight)
            .then((response) => {
                const updatedData = response.data; // Dữ liệu chuyến bay sau khi chỉnh sửa được trả về từ API

                // Cập nhật danh sách flights với thông tin chuyến bay đã chỉnh sửa
                setFlights((prevFlights) =>
                    prevFlights.map((flight) =>
                        flight.id === updatedData.id ? updatedData : flight
                    )
                );

                setOpenEditDialog(false); // Đóng hộp thoại chỉnh sửa
            })
            .catch((error) => {
                console.error("Error updating flight:", error);
            });
        */

        setFlights((prevFlights) =>
            prevFlights.map((flight) =>
                flight.id === updatedFlight.id ? updatedFlight : flight
            )
        );

        setOpenEditDialog(false); // Đóng hộp thoại chỉnh sửa

    };

    // Xóa chuyến bay
    const handleDeleteFlight = (index) => {
        const updatedFlights = flights.filter((_, i) => i !== index);
        setFlights(updatedFlights);
    };

    // Định nghĩa các cột cho DataGrid
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "flightNumber", headerName: "Flight Number", width: 150 },
        { field: "departure", headerName: "Departure", width: 150 },
        { field: "destination", headerName: "Destination", width: 150 },
        { field: "departureDate", headerName: "Departure Date", width: 150 },
        { field: "arrivalDate", headerName: "Arrival Date", width: 150 },
        { field: "price", headerName: "Price ($)", width: 120 },
        { field: "availableSeats", headerName: "Available Seats", width: 150 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "airbus", headerName: "Airbus", width: 120 },
        {
            field: "action", headerName: "Actions", width: 150, sortable: false,
            renderCell: (params) => (
                <>
                    {/* Sử dụng id để tìm đúng hàng */}
                    <IconButton color="primary" onClick={() => handleEditFlight(params.row.id - 1)} > <Edit /></IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteFlight(params.row.id - 1)} > <Delete /></IconButton>
                </>
            ),
        },
    ];

    // Tạo danh sách hàng từ dữ liệu flights
    const rows = flights.map((flight, index) => ({
        id: index + 1, // Gán ID duy nhất (nếu không có trong API)
        flightNumber: flight.flightNumber,
        departure: flight.departure,
        destination: flight.destination,
        departureDate: flight.departureDate,
        arrivalDate: flight.arrivalDate,
        price: flight.price,
        availableSeats: flight.availableSeats,
        status: flight.status,
        airbus: flight.airbus,
    }));

    return (
        <Paper style={{ width: "100%", padding: "20px", overflow: "hidden" }}>
            <Typography variant="h4" gutterBottom>
                Flights List
            </Typography>

            {/* Các trường nhập liệu để lọc chuyến bay */}
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    label="Origin Code"
                    variant="outlined"
                    value={originCode}
                    onChange={(e) => setOriginCode(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <TextField
                    label="Destination Code"
                    variant="outlined"
                    value={destinationCode}
                    onChange={(e) => setDestinationCode(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <TextField
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchFlights}
                >
                    Search Flights
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Add />}
                    onClick={() => setOpenAddDialog(true)}
                >
                    Add Flight
                </Button>
            </div>

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
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

            {/* Pop-up thêm chuyến bay */}
            <AddFlight
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                columns={columns}
                onAdd={handleAddFlight}
            />

            {/* Pop-up chỉnh sửa chuyến bay */}
            <AddFlight
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                columns={columns}
                editingFlight={editingFlight}
                onEdit={handleSaveEditedFlight}
            />

        </Paper>
    );
}
