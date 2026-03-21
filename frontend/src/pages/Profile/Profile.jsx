import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserAuth } from "../../context/AuthContext";
import styles from "./Profile.module.css";

const API_URL = "http://localhost:8000/api/";

const FORM = {
    name: "",
    age: "",
    phone: "",
    address: "",
    skills: "",
    organization: "",
    pfp: null,
};

const Profile = () => {
    const { user, dbUser, setDbUser, logOut } = UserAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(FORM);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (dbUser) {
            setForm({
                name: dbUser.name || user.displayName,
                age: dbUser.age || "",
                phone: dbUser.phone || "",
                address: dbUser.address || "",
                skills: dbUser.skills || "",
                organization: dbUser.organization || "",
                pfp: null,
            });
            setPreviewUrl(
                dbUser.pfp ? `http://localhost:8000/${dbUser?.pfp}` : null,
            );
        }
    }, [dbUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((prev) => ({ ...prev, pfp: file }));
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("age", form.age);
            formData.append("phone", form.phone);
            formData.append("address", form.address);
            formData.append("skills", form.skills);
            formData.append("organization", form.organization);
            if (form.pfp) formData.append("pfp", form.pfp);

            const res = await fetch(`${API_URL}update/`, {
                method: "PATCH",
                headers: { Email: user.email },
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to save");
            const updated = await res.json();
            setDbUser(updated);
            setEditing(false);
            toast.success("Profile updated!");
        } catch (err) {
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setForm({
            name: dbUser?.name || "",
            age: dbUser?.age || "",
            phone: dbUser?.phone || "",
            address: dbUser?.address || "",
            skills: dbUser?.skills || "",
            organization: dbUser?.organization || "",
            pfp: null,
        });
        setPreviewUrl(dbUser?.pfp ? `${API_URL}${dbUser.pfp}` : null);
    };

    const handleSignOut = async () => {
        try {
            await logOut();
            toast.success("Signed out");
            navigate("/");
        } catch {
            toast.error("Failed to sign out");
        }
    };

    if (!user) {
        return (
            <div className={styles.centered}>
                <p>You are not signed in.</p>
                <button onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }

    const fields = [
        { label: "Name", name: "name", type: "text" },
        { label: "Age", name: "age", type: "number" },
        { label: "Phone", name: "phone", type: "tel" },
        { label: "Organization", name: "organization", type: "text" },
    ];

    return (
        <div className={styles.appcontainer}>
            <motion.div
                className={styles.layout}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className={styles.leftCol}>
                    <div className={styles.avatarCard}>
                        <div className={styles.avatarFrame}>
                            <img
                                src={
                                    previewUrl ||
                                    user.photoURL ||
                                    "/default-avatar.png"
                                }
                                alt="Profile"
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.shine} />

                        {editing && (
                            <label className={styles.changePhoto}>
                                Change Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className={styles.photoInput}
                                />
                            </label>
                        )}
                        <h1 className={styles.avatarName}>
                            {dbUser?.name || user.displayName}
                        </h1>
                        <p className={styles.avatarEmail}>{user.email}</p>
                        <div className={styles.points}>
                            {dbUser?.tf_points ?? 0} Techfest Points
                        </div>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.sectionHead}>
                        <h1 className={styles.pageTitle}>Profile</h1>
                        <div className={styles.headActions}>
                            {!editing && (
                                <button
                                    className={styles.editBtn}
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                className={styles.signOutBtn}
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <div className={styles.fields}>
                        {fields.map(({ label, name, type }) => (
                            <div className={styles.fieldRow} key={name}>
                                <div className={styles.fieldLabel}>{label}</div>
                                {editing ? (
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                    />
                                ) : (
                                    <span className={styles.fieldValue}>
                                        {dbUser?.[name] || (
                                            <span className={styles.empty}>
                                                —
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        ))}

                        <div className={styles.fieldRow}>
                            <span className={styles.fieldLabel}>Address</span>
                            {editing ? (
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    placeholder="Enter address"
                                    rows={2}
                                />
                            ) : (
                                <span className={styles.fieldValue}>
                                    {dbUser?.address || (
                                        <span className={styles.empty}>—</span>
                                    )}
                                </span>
                            )}
                        </div>

                        <div className={styles.fieldRow}>
                            <span className={styles.fieldLabel}>Skills</span>
                            {editing ? (
                                <textarea
                                    name="skills"
                                    value={form.skills}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    placeholder="e.g. React, Python, Design"
                                    rows={2}
                                />
                            ) : (
                                <span className={styles.fieldValue}>
                                    {dbUser?.skills || (
                                        <span className={styles.empty}>—</span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    {editing && (
                        <div className={styles.editActions}>
                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
