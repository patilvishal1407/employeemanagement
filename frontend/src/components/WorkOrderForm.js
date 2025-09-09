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

const priorityOptions = ["low", "medium", "high"];
const statusOptions = ["open", "in_progress", "completed", "cancelled"];

export default function WorkOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { showToast } = React.useContext(ToastContext);

  const [equipments, setEquipments] = React.useState([]);
  const [technicians, setTechnicians] = React.useState([]);
  const [form, setForm] = React.useState({
    title: "",
    equipment: "",
    priority: "medium",
    status: "open",
    assignedTechnician: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    (async () => {
      try {
        const [eq, techs] = await Promise.all([
          api.get('/equipment'),
          api.get('/users?role=technician'),
        ]);
        console.log("eqeq", eq)
        console.log("techs", techs)
        setEquipments(eq);
        setTechnicians(techs);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const data = await api.get(`/workorders`);
        const item = data.find((x) => x._id === id);
        if (!item) throw new Error("Work order not found");
        setForm({
          title: item.title || "",
          equipment: item.equipment?._id || "",
          priority: item.priority || "medium",
          status: item.status || "open",
          assignedTechnician: item.assignedTechnician?._id || "",
          description: item.description || "",
          dueDate: item.dueDate ? item.dueDate.substring(0, 10) : "",
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

    if (!form.title || form.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!form.equipment) {
      newErrors.equipment = "Equipment is required";
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
        dueDate: form.dueDate || null,
        assignedTechnician: form.assignedTechnician || null,
      };
      if (isEdit) {
        await api.put(`/workorders/${id}`, payload);
        showToast("Work order updated", "success");
      } else {
        await api.post(`/workorders`, payload);
        showToast("Work order created", "success");
      }
      navigate("/workorders");
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
          {isEdit ? "Edit Work Order" : "Create Work Order"}
        </Typography>
        <Button
          startIcon={<IoMdArrowBack />}
          onClick={() => navigate('/workorders')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
      </Box>
      <Box component="form" onSubmit={onSubmit} noValidate>

        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={onChange}
          margin="normal"
          required
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          select
          fullWidth
          label="Equipment"
          name="equipment"
          value={form.equipment}
          onChange={onChange}
          margin="normal"
          required
          error={!!errors.equipment}
          helperText={errors.equipment}
        >
          <MenuItem value="">Select Equipment</MenuItem>
          {equipments.map(e => (
            <MenuItem key={e._id} value={e._id}>
              {e.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={onChange}
          margin="normal"
          required
        >
          {priorityOptions.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {priority}
            </MenuItem>
          ))}
        </TextField>

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
          select
          fullWidth
          label="Assigned Technician"
          name="assignedTechnician"
          value={form.assignedTechnician}
          onChange={onChange}
          margin="normal"
        >
          <MenuItem value="">Unassigned</MenuItem>
          {technicians.map(tech => (
            <MenuItem key={tech._id} value={tech._id}>
              {tech.name} ({tech.email})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Due Date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={onChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={onChange}
          margin="normal"
          multiline
          rows={4}
        />


        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Saving..." : (isEdit ? "Update Work Order" : "Create Work Order")}
        </Button>
      </Box>
    </Paper>
  );
}