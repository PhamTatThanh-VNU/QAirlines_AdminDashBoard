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
  CircularProgress
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

const NewsManagement = () => {
  // State Management
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
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
    </Box>
  ) :
  (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" component="h1">
              Quản lý Tin tức
            </Typography>
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm tin tức..."
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
            />
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              disabled={isLoading.saving}
            >
              Thêm Tin tức
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
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
                  <TableCell>{newsItem.title}</TableCell>
                  <TableCell>
                    {new Date(newsItem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {newsItem.status === "PUBLISHED" ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <DraftsIcon color="primary" />                        
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {newsItem.status === "DRAFT" ? (
                      <Tooltip title="Xuất bản">
                        <IconButton
                          color="success"
                          onClick={() => handleAcceptNews(newsItem.id)}
                          disabled={isLoading.accepting}
                        >
                          {isLoading.deleting ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <PublishIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Tooltip title="Chỉnh sửa">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(newsItem)}
                        disabled={isLoading.saving}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteConfirmation(newsItem.id)}
                        disabled={isLoading.deleting}
                      >
                         {isLoading.deleting ? (
                          <CircularProgress size={24} color="inherit" />
                          ) : 
                          (<DeleteIcon />)
                          }
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* News Edit/Create Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Chỉnh sửa Tin tức' : 'Thêm Tin tức Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              variant="outlined"
              value={currentNews.title}
              onChange={(e) => setCurrentNews(prev => ({
                ...prev, 
                title: e.target.value
              }))}
              sx={{ mb: 3 }}
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
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button 
            onClick={handleSaveNews} 
            variant="contained" 
            color="primary"
            disabled={isLoading.saving}
          >
            {isLoading.saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditing ? (
              "Lưu"
            ) : (
              "Tạo"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa tin tức này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteNews} 
            variant="contained" 
            color="error"
            disabled={isLoading.deleting}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsManagement;
