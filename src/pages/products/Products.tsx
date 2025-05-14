import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ColorLens as ColorIcon,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  category: string;
  colors: string[];
  price: number;
  batch: string;
}

const Products: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
  const [currentColor, setCurrentColor] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // بيانات وهمية للعرض
  const [products, setProducts] = useState<Product[]>([
    { 
      id: '1', 
      name: 'دهان داخلي لامع', 
      category: 'ديكوري', 
      colors: ['أبيض', 'بيج فاتح', 'أزرق سماوي'],
      price: 250,
      batch: 'BATCH-001'
    },
    { 
      id: '2', 
      name: 'دهان خارجي عازل', 
      category: 'إنشائي', 
      colors: ['أبيض', 'أحمر', 'أخضر'],
      price: 350,
      batch: 'BATCH-002'
    },
    { 
      id: '3', 
      name: 'دهان واجهات', 
      category: 'واجهات خارجية', 
      colors: ['أصفر', 'برتقالي', 'بني'],
      price: 400,
      batch: 'BATCH-003'
    },
  ]);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({ 
    name: '', 
    category: 'ديكوري',
    colors: [],
    price: 0,
    batch: ''
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (type: 'add' | 'edit', product?: Product) => {
    setDialogType(type);
    if (type === 'edit' && product) {
      setFormData(product);
    } else {
      setFormData({ 
        name: '', 
        category: 'ديكوري',
        colors: [],
        price: 0,
        batch: ''
      });
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddColor = () => {
    if (currentColor.trim() && !formData.colors.includes(currentColor.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, currentColor.trim()],
      });
      setCurrentColor('');
    }
  };

  const handleDeleteColor = (colorToDelete: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((color) => color !== colorToDelete),
    });
  };

  const handleSubmit = () => {
    if (dialogType === 'add') {
      // إضافة منتج جديد
      const newProduct = {
        ...formData,
        id: (products.length + 1).toString(),
      };
      setProducts([...products, newProduct]);
    } else if (selectedProduct) {
      // تعديل المنتج المحدد
      const updatedProducts = products.map(product =>
        product.id === selectedProduct.id ? { ...formData, id: product.id } : product
      );
      setProducts(updatedProducts);
    }
    setOpenDialog(false);
  };

  const handleDelete = () => {
    if (selectedProduct) {
      const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
      setProducts(updatedProducts);
      handleMenuClose();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productCategories = ['ديكوري', 'إنشائي', 'واجهات خارجية'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          المنتجات
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          إضافة منتج
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 400 }}
          />
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="الكل" />
            {productCategories.map((category) => (
              <Tab key={category} label={category} />
            ))}
          </Tabs>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>اسم المنتج</TableCell>
              <TableCell>التصنيف</TableCell>
              <TableCell>الألوان/الباتش</TableCell>
              <TableCell>السعر</TableCell>
              <TableCell>رقم الباتش</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .filter(product => activeTab === 0 || product.category === productCategories[activeTab - 1])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {product.colors.map((color) => (
                        <Chip
                          key={color}
                          label={color}
                          size="small"
                          sx={{ 
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{product.price} ج.م</TableCell>
                  <TableCell>{product.batch}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, product)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="عدد الصفوف في الصفحة"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} من ${count}`
          }
        />
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenDialog('edit', selectedProduct!)}>
          <EditIcon sx={{ ml: 1 }} />
          تعديل
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ ml: 1 }} />
          حذف
        </MenuItem>
      </Menu>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            minHeight: '60vh',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          {dialogType === 'add' ? 'إضافة منتج جديد' : 'تعديل بيانات المنتج'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="اسم المنتج"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>تصنيف المنتج</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleSelectChange}
                label="تصنيف المنتج"
              >
                <MenuItem value="ديكوري">ديكوري</MenuItem>
                <MenuItem value="إنشائي">إنشائي</MenuItem>
                <MenuItem value="واجهات خارجية">واجهات خارجية</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                الألوان/الباتش
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="أضف لون/باتش"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddColor}
                  startIcon={<ColorIcon />}
                >
                  إضافة
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40, p: 1, border: '1px dashed #ccc', borderRadius: 1 }}>
                {formData.colors.length > 0 ? (
                  formData.colors.map((color) => (
                    <Chip
                      key={color}
                      label={color}
                      onDelete={() => handleDeleteColor(color)}
                      sx={{ 
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '& .MuiChip-deleteIcon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    لا توجد ألوان مضافة
                  </Typography>
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              type="number"
              label="السعر"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: 'ج.م',
                inputProps: { min: 0 }
              }}
              required
            />

            <TextField
              fullWidth
              label="رقم الباتش"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.category || formData.colors.length === 0 || !formData.price || !formData.batch}
          >
            {dialogType === 'add' ? 'إضافة' : 'حفظ التغييرات'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
