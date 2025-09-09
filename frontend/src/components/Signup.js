import React, { useState, useContext } from "react";
import { Container, CssBaseline, Paper, TextField, Button, Avatar, Typography, MenuItem } from "@mui/material";
import { FaUserPlus } from "react-icons/fa";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ToastContext } from "../context/ToastContext";

const roles = [
    { label: "Technician", value: "technician" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Manager", value: "manager" },
];

export default function Signup() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "technician" });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/signup", formData);
            login(res.token, res.user);
            if (res.user?.role === "manager" || res.user?.role === "supervisor") navigate("/equipment");
            else navigate("/workorders");
        } catch (err) {
            showToast(err.message || "Signup failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={6} sx={{ mt: 8, p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <FaUserPlus />
                </Avatar>
                <Typography component="h1" variant="h5">Sign Up</Typography>
                <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 16 }}>
                    <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <TextField select fullWidth margin="normal" label="Role" name="role" value={formData.role} onChange={handleChange}>
                        {roles.map(r => (<MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>))}
                    </TextField>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account? <Link to="/login">Sign In</Link>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
}


