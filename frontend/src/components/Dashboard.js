import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import { generateTechnicianWorkloadPDF } from "../utils/pdfGenerator";

export default function Dashboard() {
  const { user } = React.useContext(AuthContext);
  const { showToast } = React.useContext(ToastContext);
  const [counts, setCounts] = React.useState({ equipment: 0, workorders: 0 });
  const [assigned, setAssigned] = React.useState([]);
  const [workloadData, setWorkloadData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const [eq, wo, techs] = await Promise.all([
          api.get('/equipment'),
          api.get('/workorders'),
          api.get('/users?role=technician')
        ]);
        setCounts({ equipment: eq.length, workorders: wo.length });
        
        if (user?.role === 'technician') {
          const mine = wo.filter(w => w.assignedTechnician && w.assignedTechnician._id === user.id);
          setAssigned(mine);
        }
        
        // Calculate workload data
        const workload = techs.map(tech => {
          const techWorkOrders = wo.filter(w => w.assignedTechnician && w.assignedTechnician._id === tech._id);
          const statusCounts = techWorkOrders.reduce((acc, w) => {
            acc[w.status] = (acc[w.status] || 0) + 1;
            return acc;
          }, {});
          
          return {
            name: tech.name,
            open: statusCounts.open || 0,
            in_progress: statusCounts.in_progress || 0,
            completed: statusCounts.completed || 0,
            cancelled: statusCounts.cancelled || 0,
            total: techWorkOrders.length
          };
        });
        
        setWorkloadData(workload);
      } catch (e) {
        showToast("Error loading dashboard data", "error");
      }
    })();
  }, [user, showToast]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'open': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const downloadWorkloadReport = () => {
    try {
      const pdf = generateTechnicianWorkloadPDF(workloadData);
      pdf.save('technician-workload.pdf');
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Dashboard
        </Typography>
        {(user?.role === 'supervisor' || user?.role === 'manager') && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={downloadWorkloadReport}
            sx={{ px: 3, py: 1.2 }}
          >
            Download Workload PDF
          </Button>
        )}
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Equipment
              </Typography>
              <Typography variant="h4" component="div">
                {counts.equipment}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Work Orders
              </Typography>
              <Typography variant="h4" component="div">
                {counts.workorders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {user?.role === 'technician' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Assigned Work Orders
            </Typography>
            {assigned.length === 0 ? (
              <Typography color="textSecondary">
                No assigned work orders
              </Typography>
            ) : (
              <List>
                {assigned.map((workOrder) => (
                  <ListItem key={workOrder._id} divider>
                    <ListItemText
                      primary={workOrder.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={workOrder.status}
                            color={getStatusColor(workOrder.status)}
                            size="small"
                          />
                          <Chip
                            label={workOrder.priority}
                            color={getPriorityColor(workOrder.priority)}
                            size="small"
                          />
                          {workOrder.dueDate && (
                            <Typography variant="caption" color="textSecondary">
                              Due: {new Date(workOrder.dueDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Paper>
  );
}