"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    FormControl,
    FormHelperText,
    Box,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "@/lib/validations";
import { useUsers } from "@/hooks/useUsers";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function AddEmployeeDialog({ open, onClose, initialData = null }) {
    const { createNewEmployee, updateUser } = useUsers();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            role: "employee",
        },
    });

    // initialize form for edit mode or reset for create
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                email: initialData.email || "",
                phoneNo: initialData.phoneNo || "",
                password: "",
                role: initialData.role || "employee",
            });
        } else {
            reset({
                name: "",
                email: "",
                phoneNo: "",
                password: "",
                role: "employee",
            });
        }
    }, [initialData, open, reset]);

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                // updateUser expects { data } shape — keep consistent with useUsers hook
                await updateUser.mutateAsync({
                    data: {
                        userId: initialData._id,
                        ...data,
                    },
                });
                onClose();
                return;
            }

            // Create flow
            await createNewEmployee.mutateAsync({ data });
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    const creating = createNewEmployee?.isPending;
    const updating = updateUser?.isPending;

    return (
        <Dialog
            open={!!open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="add-employee-dialog"
        >
            <DialogTitle id="add-employee-dialog" className="flex items-center justify-between">
                {initialData ? "Edit Employee" : "Create New Employee"}
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {/* Name */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField {...register("name")} label="Name" error={Boolean(errors.name)} />
                        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    {/* Email */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
                        <TextField {...register("email")} label="Email" error={Boolean(errors.email)} />
                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                    </FormControl>

                    {/* Phone */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.phoneNo)}>
                        <TextField {...register("phoneNo")} label="Phone No" error={Boolean(errors.phoneNo)} />
                        {errors.phoneNo && <FormHelperText>{errors.phoneNo.message}</FormHelperText>}
                    </FormControl>

                    {/* Password */}
                    {!initialData &&
                        <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                            <TextField
                                {...register("password")}
                                label={initialData ? "Password (leave blank to keep current)" : "Password"}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                error={Boolean(errors.password)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword ? "hide the password" : "display the password"}
                                                onClick={() => setShowPassword((s) => !s)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                        </FormControl>
                    }

                    {/* role (hidden) */}
                    <input type="hidden" {...register("role")} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={creating || updating}
                    >
                        {initialData ? "Save Changes" : "Save"}
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
