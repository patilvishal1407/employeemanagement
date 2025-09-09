import React from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";

import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { ToastContext } from "../context/ToastContext";

const statusOptions = ["operational", "maintenance_due", "down"];

export default function EquipmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { showToast } = React.useContext(ToastContext);

  const [form, setForm] = React.useState({
    name: "",
    type: "",
    status: "operational",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const data = await api.get(`/equipment`);
        const item = data.find((x) => x._id === id);
        if (!item) throw new Error("Equipment not found");
        setForm({
          name: item.name || "",
          type: item.type || "",
          status: item.status || "operational",
          lastMaintenanceDate: item.lastMaintenanceDate ? item.lastMaintenanceDate.substring(0, 10) : "",
          nextMaintenanceDate: item.nextMaintenanceDate ? item.nextMaintenanceDate.substring(0, 10) : "",
        });
      } catch (e) {
        showToast(e.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, showToast]);

  const validate = () => {
    let newErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.type || form.type.trim().length < 2) {
      newErrors.type = "Type must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors({ ...errors, [name]: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        ...form,
        lastMaintenanceDate: form.lastMaintenanceDate || null,
        nextMaintenanceDate: form.nextMaintenanceDate || null,
      };
      if (isEdit) {
        await api.put(`/equipment/${id}`, payload);
        showToast("Equipment updated", "success");
      } else {
        await api.post(`/equipment`, payload);
        showToast("Equipment created", "success");
      }
      navigate("/equipment");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", mb: 3 }}>

        <Typography variant="h6">
          {isEdit ? "Edit Equipment" : "Add New Equipment"}
        </Typography>
        <Button
          startIcon={<IoMdArrowBack />}
          onClick={() => navigate('/equipment')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      </Box>
      
      <Box component="form" onSubmit={onSubmit} noValidate>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={onChange}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          fullWidth
          label="Type"
          name="type"
          value={form.type}
          onChange={onChange}
          margin="normal"
          required
          error={!!errors.type}
          helperText={errors.type}
        />

        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={form.status}
          onChange={onChange}
          margin="normal"
          required
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Last Maintenance Date"
          name="lastMaintenanceDate"
          type="date"
          value={form.lastMaintenanceDate}
          onChange={onChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Next Maintenance Date"
          name="nextMaintenanceDate"
          type="date"
          value={form.nextMaintenanceDate}
          onChange={onChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Saving..." : (isEdit ? "Update Equipment" : "Save Equipment")}
        </Button>
      </Box>
    </Paper>
  );
}