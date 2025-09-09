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
import { generateEquipmentStatusPDF } from "../utils/pdfGenerator";

const statusOptions = ["All", "operational", "maintenance_due", "down"];

export default function EquipmentList() {
  const { user } = React.useContext(AuthContext);
  const { showToast } = React.useContext(ToastContext);
  const navigate = useNavigate();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("All");

  const canEdit = user && (user.role === "supervisor" || user.role === "manager");

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.get("/equipment");
      setItems(data);
    } catch (e) {
      showToast("Error fetching equipment", "error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await api.delete(`/equipment/${id}`);
      showToast("Equipment deleted", "success");
      await load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleEdit = (id) => {
    navigate(`/equipment/${id}`);
  };

  const handleAdd = () => {
    navigate("/equipment/new");
  };

  const downloadReport = () => {
    try {
      // Filter data based on current filters
      let filteredData = items;
      if (filterStatus && filterStatus !== "All") {
        filteredData = items.filter(item => item.status === filterStatus);
      }
      
      // Generate PDF using frontend library
      const pdf = generateEquipmentStatusPDF(filteredData);
      pdf.save('equipment-status.pdf');
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "All" || item.status === filterStatus)
    );
  });

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Equipment List
      </Typography>

      <Card sx={{ height: "100%", width: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                label="Search by name"
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              {(user?.role === 'supervisor' || user?.role === 'manager') && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={downloadReport}
                  sx={{ px: 3, py: 1.2 }}
                >
                  Download PDF
                </Button>
              )}
            </Grid>

            <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
            >
              {canEdit && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAdd}
                  sx={{ px: 3, py: 1.2 }}
                >
                  Add Equipment
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
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Maintenance</TableCell>
                  <TableCell>Next Maintenance</TableCell>
                  {canEdit && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {item.lastMaintenanceDate 
                        ? new Date(item.lastMaintenanceDate).toLocaleDateString() 
                        : '—'
                      }
                    </TableCell>
                    <TableCell>
                      {item.nextMaintenanceDate 
                        ? new Date(item.nextMaintenanceDate).toLocaleDateString() 
                        : '—'
                      }
                    </TableCell>
                    {canEdit && (
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
                          {user.role === 'manager' && (
                            <Button
                              color="error"
                              variant="outlined"
                              size="small"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    )}
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