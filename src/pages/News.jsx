import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
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
  InputAdornment,
  IconButton,
  Grid,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  styled,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  fetchAllNews, 
  createNews, 
  updateNews, 
  deleteNews,
  acceptNews
} from '../services';
import PublishIcon from '@mui/icons-material/Publish';
import DraftsIcon from '@mui/icons-material/Drafts';
import './CSS/CustomQuillEditor.css';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      border: 'none',
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      padding: theme.spacing(2),
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        transform: 'scale(1.01)',
      },
      '& .MuiTableCell-root': {
        border: 'none',
        padding: theme.spacing(2),
        '&:first-of-type': {
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
        },
        '&:last-of-type': {
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
        }
      }
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.35)}`,
  }
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.2),
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.15),
    transform: 'scale(1.1)',
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
    backdropFilter: 'blur(10px)',
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  paddingBottom: theme.spacing(2),
}));

const NewsManagement = () => {
  const [isLoading, setIsLoading] = useState({
      fetching: false,
      saving: false,
      deleting: false,
      accepting: false
  });
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [currentNews, setCurrentNews] = useState({
    id: null,
    title: '',
    content: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Quill Modules Configuration
  const quillModules = {
    toolbar: [     
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['small', 'medium', 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': []}, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ]
  };

  // Fetch News Data
  const loadNews = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, fetching: true }));
      const data = await fetchAllNews();
      setNews(data);
    } catch (error) {
      handleSnackbarOpen('Không thể tải tin tức', 'error');
    } finally{
      setIsLoading((prev) => ({ ...prev, fetching: false }));
    }
  }, []);

  // Effect to load news on component mount
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Snackbar Handling
  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Dialog Management
  const handleOpenDialog = (newsItem = null) => {
    if (newsItem) {
      setCurrentNews(newsItem);
      setIsEditing(true);
    } else {
      setCurrentNews({ id: null, title: '', content: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentNews({ id: null, title: '', content: '' });
  };

  // News CRUD Operations
  const handleSaveNews = async () => {
    if (!currentNews.title.trim()) {
      handleSnackbarOpen('Tiêu đề không được để trống', 'error');
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, saving: true }));
      if (isEditing) {
        await updateNews(currentNews.id, {
          title: currentNews.title,
          content: currentNews.content
        });
        handleSnackbarOpen('Cập nhật tin tức thành công');
      } else {
        await createNews({
          title: currentNews.title,
          content: currentNews.content
        });
        handleSnackbarOpen('Tạo tin tức mới thành công');
      }
      loadNews();
      handleCloseDialog();
    } catch (error) {
      handleSnackbarOpen('Lỗi khi lưu tin tức', 'error');
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  // Confirmation Dialog for Delete
  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleDeleteNews = async () => {
    if (!deleteId) return;

    try {
      setIsLoading((prev) => ({ ...prev, deleting: true }));
      await deleteNews(deleteId);
      loadNews();
      handleSnackbarOpen('Xóa tin tức thành công');
      setOpenConfirmDialog(false);
    } catch (error) {
      handleSnackbarOpen('Không thể xóa tin tức', 'error');
    } finally {
      setIsLoading((prev) => ({ ...prev, deleting: false }));
    }
  };

  // Accept Draft to Published
  const handleAcceptNews = async (id) => {
    try {
      setIsLoading((prev) => ({ ...prev, accepting: true }));
      await acceptNews(id);
      loadNews();
      handleSnackbarOpen('Chấp nhận tin tức thành công');
    } catch (error) {
      handleSnackbarOpen('Không thể chấp nhận tin tức', 'error');
    } finally {
      setIsLoading((prev) => ({ ...prev, accepting: false }));
    }
  };

  // Filtering News
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return isLoading.fetching ? (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <CircularProgress size={40} thickness={4} />
    </Box>
  ) : (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledPaper>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Grid item>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: '-webkit-linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quản lý Tin tức
            </Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StyledSearchField
              variant="outlined"
              placeholder="Tìm kiếm tin tức..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                )
              }}
            />
            <StyledButton 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              disabled={isLoading.saving}
            >
              Thêm Tin tức
            </StyledButton>
          </Grid>
        </Grid>

        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>              
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNews.map((newsItem) => (
                <TableRow key={newsItem.id}>                  
                  <TableCell sx={{ fontWeight: 500 }}>{newsItem.title}</TableCell>
                  <TableCell>
                    {new Date(newsItem.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {newsItem.status === "PUBLISHED" ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon color="success" />
                        <Typography variant="body2" color="success.main">
                          Đã xuất bản
                        </Typography>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <DraftsIcon color="primary" />
                        <Typography variant="body2" color="primary">
                          Bản nháp
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {newsItem.status === "DRAFT" && (
                        <Tooltip title="Xuất bản">
                          <StyledIconButton
                            color="success"
                            onClick={() => handleAcceptNews(newsItem.id)}
                            disabled={isLoading.accepting}
                          >
                            {isLoading.accepting ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <PublishIcon />
                            )}
                          </StyledIconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Chỉnh sửa">
                        <StyledIconButton 
                          color="primary" 
                          onClick={() => handleOpenDialog(newsItem)}
                          disabled={isLoading.saving}
                        >
                          <EditIcon />
                        </StyledIconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <StyledIconButton 
                          color="error" 
                          onClick={() => handleDeleteConfirmation(newsItem.id)}
                          disabled={isLoading.deleting}
                        >
                          {isLoading.deleting ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </StyledIconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>

      {/* News Edit/Create Dialog */}
      <StyledDialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          {isEditing ? 'Chỉnh sửa Tin tức' : 'Thêm Tin tức Mới'}
        </StyledDialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              variant="outlined"
              value={currentNews.title}
              onChange={(e) => setCurrentNews(prev => ({
                ...prev, 
                title: e.target.value
              }))}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
              required
            />        
            <ReactQuill
              theme="snow"
              value={currentNews.content}
              onChange={(content) => setCurrentNews(prev => ({
                ...prev, 
                content
              }))}
              modules={quillModules}
              style={{ 
                height: '300px', 
                marginBottom: '50px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <StyledButton 
            onClick={handleCloseDialog} 
            color="inherit"
            variant="outlined"
          >
            Hủy
          </StyledButton>
          <StyledButton 
            onClick={handleSaveNews} 
            variant="contained" 
            color="primary"
            disabled={isLoading.saving}
          >
            {isLoading.saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Tạo tin tức"
            )}
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Confirmation Dialog */}
      <StyledDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <StyledDialogTitle>Xác nhận xóa</StyledDialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <StyledButton 
            onClick={() => setOpenConfirmDialog(false)} 
            color="inherit"
            variant="outlined"
          >
            Hủy
          </StyledButton>
          <StyledButton 
            onClick={handleDeleteNews} 
            variant="contained" 
            color="error"
            disabled={isLoading.deleting}
          >
            {isLoading.deleting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Xóa"
            )}
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsManagement;