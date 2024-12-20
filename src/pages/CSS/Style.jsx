const styles = {
    boxBackground: {
        background: 'rgba(108, 204, 171, 0.67)',
        color: '#ffffff',
        borderRadius: '10px',
        padding: '24px',
        marginBottom: '24px',
    },
    tableContainer: {
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    tableHeader: {
        background: 'rgba(108, 204, 171, 0.67)',
        '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1rem',
        },
    },
    actionButton: {
        borderRadius: '5px',
        textTransform: 'uppercase',
        padding: '8px 24px',
        fontWeight: 'bold',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: '#8DD3BA',
        '&:hover': {
            backgroundColor: '#7BC4A7',
        },
    },
    searchField: {
        background: 'whitesmoke',
        border: '1px solid #e0e0e0',
        borderRadius: '5px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: '#7BC4A7',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#7BC4A7',
            },
        },
    },
    searchIcon: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    dialogTitle: {
        background: 'rgba(108, 204, 171, 0.67)',
        color: '#ffffff',
        padding: '16px 24px',
    },
    dialogContent: {
        padding: '24px',
    },
    tableRow: {
        '&:hover': {
            background: 'rgba(142, 211, 186, 0.1)',
        },
    },
    iconButton: {
        borderRadius: '50%',
        padding: '8px',
        '&:hover': {
            background: 'rgba(118, 128, 124, 0.2)',
        },
    },

    // style for flight table
    buttonPrimary: {
        backgroundColor: '#8DD3BA',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        '&:hover': {
            backgroundColor: '#6bb598',
        },
    },
    buttonSecondary: {
        backgroundColor: '#ffffff',
        color: '#8DD3BA',
        border: '2px solid #8DD3BA',
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },

    dataGridContainer: {
        marginTop: '16px',
        height: 'auto',
        width: '100%',
        // backgroundColor: '#ffffff',
    },

    dataGrid: {
        border: 'none',
        // đổi màu của background container
        '--DataGrid-containerBackground': '#8DD3BA',

        '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #E0E0E0',
        },

        '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'whitesmoke',
            borderTop: '1px solid #E0E0E0',
        },

        '& .MuiDataGrid-toolbarContainer': {
            padding: '0 8px 10px 8px',
            '& .MuiButtonBase-root': {
                color: '#8DD3BA',
                fontWeight: '500',
            },
        },

        '& .MuiDataGrid-main': {
            paddingTop: '10px',
        },

        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#8DD3BA', // header background color
            color: '#ffffff', // header text color
            fontWeight: 'bold',
            textAlign: 'center',
            justifyContent: 'center',
        },

        '& .MuiDataGrid-columnHeaders .MuiCheckbox-root': {
            color: '#ffffff', // White color for header checkbox
            backgroundColor: '#8DD3BA', // Match header background if needed
            '&:hover': {
                backgroundColor: '#6fb09b', // Lighter hover effect
            },
        },

        '& .MuiDataGrid-row': {
            backgroundColor: 'white', // Set the row background color to white
            '&:hover': {
                backgroundColor: 'rgba(142, 211, 186, 0.1)', // Hover row color
            }
        },
        '& .MuiCheckbox-root': {
            color: '#8DD3BA', // checkbox color
        },
        '& .MuiCheckbox-root.Mui-checked': {
            color: '#00695C', // checkbox color when checked
        },
        '& .MuiCheckbox-root.Mui-checked:hover': {
            backgroundColor: 'rgba(142, 211, 186, 0.3)', // hover effect for checked checkbox
        },
        '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: 'rgba(142, 211, 186, 0.3)', // Background when selected
            '&:hover': {
                backgroundColor: 'rgba(142, 211, 186, 0.5)', // Background on hover when selected
            },
        },
        '& .MuiDataGrid-scrollbar--horizontal': {
            height: '5px',
        }

        // footer: {
        //     backgroundColor: '#f4f6f8',
        //     borderTop: '1px solid #e0e0e0',
        // },
        // toolbar: {
        //     '& .MuiDataGrid-toolbarContainer': {
        //         padding: '0 8px'
        //     },
        // }

    },
    noRowsOverlay: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#8DD3BA',
    },

    snackbar: {
        root: {
            backgroundColor: '#ff5252',
            color: '#ffffff',
            fontWeight: 'bold',
        },
    },
    container: {
        maxWidth: '930px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    typographyTitle: {
        fontWeight: 'bold',
        color: '#4caf50',
        textAlign: 'center',
        marginBottom: '16px',
    },

    // style for flight no. column
    flightNumberCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },

    // style for chip
    priceChip: {
        color: 'rgba(60, 60, 60, 0.67)',
        // backgroundColor: 'rgba(172, 172, 172, 0.1)',
        fontWeight: 'bold',
    },
    statusChipBase: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    // Styles cho Snackbar/Alert
    alert: {
        width: '100%',
    },


    // style for dialog add flight
    textField: {
        margin: "dense",
        border: '1px solid #e0e0e0',
        borderRadius: '5px',
        fullWidth: true,
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: '#7BC4A7',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#7BC4A7',
            },
        },
    },
    formControl: {
        margin: "dense",
        fullWidth: true,
    },
    selectField: {
        backgroundColor: "#ffffff",
        borderRadius: "4px",
        border: '1px solid #e0e0e0',
        fullWidth: true,
        "& .MuiSelect-select": {
            padding: "16.5px 14px",
            color: "#333333",

        },
        "&:hover": {
            borderColor: '#7BC4A7',
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: '#7BC4A7',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: '#7BC4A7',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#7BC4A7',
            },
        },
        "& .Mui-selected": {
            backgroundColor: "#8DD3BA",
            color: "#ffffff",
            "&:hover": {
                backgroundColor: "#71b59d",
            },
        },
    },
    dialogActions: {
        justifyContent: "space-between",
        padding: "16px",
    },
    button: {
        textTransform: "none",
        padding: "8px 16px",
        fontWeight: "bold",
    },

    cancelButton: {
        borderRadius: '5px',
        textTransform: 'uppercase',
        padding: '8px 24px',
        fontWeight: 'bold',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        color: '#ffffff',
        border: 'none',
        background: 'rgba(241, 116, 116, 0.84)',
        '&:hover': {
            background: 'rgba(197, 32, 32, 0.87)',
            boxShadow: '0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
        },
    },

    normalButton: {
        borderRadius: '5px',
        textTransform: 'uppercase',
        padding: '8px 24px',
        fontWeight: 'bold',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        color: '#4f4f4f',
        border: 'none',
        background: 'rgba(187, 187, 187, 0.67)',
        '&:hover': {
            background: 'rgba(171, 171, 171, 0.87)',
            boxShadow: '0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
        },
    }
};

export default styles;
