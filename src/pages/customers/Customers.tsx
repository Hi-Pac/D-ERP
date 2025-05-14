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
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  category: string;
  discount: number;
}

const Customers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
  
  // بيانات وهمية للعرض
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'أحمد محمد', phone: '01001234567', address: 'القاهرة', category: 'هيئات/مشاريع', discount: 5 },
    { id: '2', name: 'محمد علي', phone: '01112233445', address: 'الجيزة', category: 'محلات', discount: 3 },
    { id: '3', name: 'سارة أحمد', phone: '01223344556', address: 'الإسكندرية', category: 'أهالي', discount: 0 },
  ]);

  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({ 
    name: '', 
    phone: '', 
    address: '', 
    category: 'أهالي', 
    discount: 0 
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (type: 'add' | 'edit', customer?: Customer) => {
    setDialogType(type);
    if (type === 'edit' && customer) {
      setFormData(customer);
    } else {
      setFormData({ 
        name: '', 
        phone: '', 
        address: '', 
        category: 'أهالي', 
        discount: 0 
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

  const handleSubmit = () => {
    if (dialogType === 'add') {
      // إضافة عميل جديد
      const newCustomer = {
        ...formData,
        id: (customers.length + 1).toString(),
      };
      setCustomers([...customers, newCustomer]);
    } else if (selectedCustomer) {
      // تعديل العميل المحدد
      const updatedCustomers = customers.map(customer =>
        customer.id === selectedCustomer.id ? { ...formData, id: customer.id } : customer
      );
      setCustomers(updatedCustomers);
    }
    setOpenDialog(false);
  };

  const handleDelete = () => {
    if (selectedCustomer) {
      const updatedCustomers = customers.filter(customer => customer.id !== selectedCustomer.id);
      setCustomers(updatedCustomers);
      handleMenuClose();
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          العملاء
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          إضافة عميل
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="ابحث عن عميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>العنوان</TableCell>
              <TableCell>التصنيف</TableCell>
              <TableCell>الخصم %</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.category}</TableCell>
                  <TableCell>{customer.discount}%</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, customer)}
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
          count={filteredCustomers.length}
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
        <MenuItem onClick={() => handleOpenDialog('edit', selectedCustomer!)}>
          <EditIcon sx={{ ml: 1 }} />
          تعديل
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ ml: 1 }} />
          حذف
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogType === 'add' ? 'إضافة عميل جديد' : 'تعديل بيانات العميل'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="الاسم"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="رقم الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="العنوان"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>تصنيف العميل</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleSelectChange}
                label="تصنيف العميل"
              >
                <MenuItem value="هيئات/مشاريع">هيئات/مشاريع</MenuItem>
                <MenuItem value="محلات">محلات</MenuItem>
                <MenuItem value="أهالي">أهالي</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="نسبة الخصم %"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              margin="normal"
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogType === 'add' ? 'إضافة' : 'حفظ التغييرات'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
