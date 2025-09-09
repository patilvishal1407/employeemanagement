import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";
import { generateWorkOrderSummaryPDF } from "../utils/pdfGenerator";

const statusOptions = ["All", "open", "in_progress", "completed", "cancelled"];

export default function WorkOrderList() {
  const { user } = React.useContext(AuthContext);
  const { showToast } = React.useContext(ToastContext);
  const navigate = useNavigate();
  const [items, setItems] = React.useState([]);
  const [filters, setFilters] = React.useState({ status: "", technician: "" });
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const canCreate = user && (user.role === "supervisor" || user.role === "manager");

  const load = async () => {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (filters.status && filters.status !== "All") qs.set('status', filters.status);
      if (filters.technician) qs.set('technician', filters.technician);
      const data = await api.get(`/workorders?${qs.toString()}`);
      setItems(data);
    } catch (e) {
      showToast("Error fetching work orders", "error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const applyFilters = async () => { await load(); };

  const handleEdit = (id) => {
    navigate(`/workorders/${id}`);
  };

  const handleAdd = () => {
    navigate("/workorders/new");
  };

  const downloadSummary = () => {
    try {
      // Filter data based on current filters
      let filteredData = items;
      if (filters.status && filters.status !== "All") {
        filteredData = items.filter(item => item.status === filters.status);
      }
      
      // Generate PDF using frontend library
      const pdf = generateWorkOrderSummaryPDF(filteredData);
      pdf.save('workorder-summary.pdf');
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const filteredItems = items.filter((item) => {
    return item.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Work Orders
      </Typography>

      <Card sx={{ height: "100%", width: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                select
                label="Filter by Status"
                name="status"
                value={filters.status}
                onChange={onFilterChange}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <Button
                variant="outlined"
                color="primary"
                onClick={applyFilters}
                sx={{ px: 3, py: 1.2 }}
              >
                Apply Filters
              </Button>
            </Grid>

            <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {(user?.role === 'supervisor' || user?.role === 'manager') && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={downloadSummary}
                  sx={{ px: 3, py: 1.2, mr: 2 }}
                >
                  Download PDF
                </Button>
              )}
              {canCreate && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAdd}
                  sx={{ px: 3, py: 1.2 }}
                >
                  Create Work Order
                </Button>
              )}

            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {filteredItems && filteredItems.length < 1 ? (
            <Typography variant="h6" gutterBottom sx={{ mt: "20px" }}>
              No Data Found
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Assigned Technician</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.equipment?.name || '—'}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>{item.assignedTechnician?.name || '—'}</TableCell>
                    <TableCell>
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          color="primary"
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(item._id)}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </Paper>
  );
}