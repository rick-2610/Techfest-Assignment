import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { UserAuth } from "../../context/AuthContext";
import styles from "./ProjectsInternal.module.css";

const API_URL = "http://13.200.148.118:8000/api/";

function formatDeadline(d) {
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const STATUS_DISPLAY = {
    locked: { label: "Locked", className: "locked" },
    "not submitted": { label: "Not Submitted", className: "notsubmitted" },
    pending: { label: "Under Review", className: "pending" },
    approved: { label: "Approved", className: "approved" },
    rejected: { label: "Rejected", className: "rejected" },
};

export default function ProjectInternal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, dbUser, setDbUser } = UserAuth();

    const [project, setProject] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [submitConfirm, setSubmitConfirm] = useState(false);
    const [comment, setComment] = useState("");
    const [subForm, setSubForm] = useState({ url: "", pdf: null, image: null });

    useEffect(() => {
        if (!user?.email) return;

        const headers = { Email: user.email };

        Promise.all([
            fetch(`${API_URL}projects/${id}/`).then((r) => r.json()),
            fetch(`${API_URL}projects/${id}/submission/`, { headers })
                .then((r) => (r.ok ? r.json() : null))
                .catch(() => null),
        ]).then(([proj, sub]) => {
            setProject(proj);
            setSubmission(sub);
            setLoading(false);
        });
    }, [id, user?.email]);

    const handleUnlock = async () => {
        setUnlocking(true);
        try {
            const res = await fetch(`${API_URL}projects/${id}/unlock/`, {
                method: "POST",
                headers: { Email: user.email },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            setSubmission(data.submission);
            setDbUser((prev) => ({
                ...prev,
                tf_points: data.remaining_points,
            }));
            toast.success("Project unlocked!");
            setConfirm(false);
        } catch {
            toast.error("Failed to unlock.");
        } finally {
            setUnlocking(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            if (subForm.url) formData.append("submission_link", subForm.url);
            if (subForm.pdf) formData.append("submission_file", subForm.pdf);
            if (subForm.image)
                formData.append("submission_image", subForm.image);
            if (comment) formData.append("comments", comment);

            const res = await fetch(`${API_URL}projects/${id}/submit/`, {
                method: "PATCH",
                headers: { Email: user.email },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed");
                return;
            }
            setSubmission(data);
            toast.success("Submitted successfully!");
        } catch {
            toast.error("Submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!project)
        return (
            <div className={styles.appcontainer}>
                <p className={styles.errorMsg}>Project not found.</p>
            </div>
        );

    const subStatus = submission?.submission_status ?? "locked";
    const isUnlocked = !!submission;
    const isSubmitted = ["pending", "approved", "rejected"].includes(subStatus);
    const canAfford = (dbUser?.tf_points ?? 0) >= project.point_to_unlock;
    const skills = project.skills_required.split(",").map((s) => s.trim());
    const statusInfo = STATUS_DISPLAY[subStatus] ?? {
        label: subStatus,
        className: "locked",
    };

    return (
        <div className={styles.appcontainer}>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <button
                    className={styles.backBtn}
                    onClick={() => navigate("/projects")}
                >
                    ← To Projects
                </button>

                <div className={styles.inner}>
                    <div className={styles.infoCol}>
                        <div className={styles.topRow}>
                            <h1 className={styles.title}>{project.title}</h1>
                            <span className={styles.category}>
                                {project.category}
                            </span>
                        </div>

                        <div>
                            <p className={styles.label}>Description</p>
                            <p className={styles.desc}>{project.description}</p>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <p className={styles.label}>Points Awarded</p>
                                <p className={styles.value}>
                                    {project.tf_points_awarded} pts
                                </p>
                            </div>
                            <div className={styles.metaItem}>
                                <p className={styles.label}>Cost to Unlock</p>
                                <p className={styles.value}>
                                    {project.point_to_unlock} pts
                                </p>
                            </div>
                            <div className={styles.metaItem}>
                                <p className={styles.label}>Deadline</p>
                                <p className={styles.value}>
                                    {formatDeadline(
                                        project.submission_deadline,
                                    )}
                                </p>
                            </div>
                            <div className={styles.metaItem}>
                                <p className={styles.label}>Your Points</p>
                                <p className={styles.value}>
                                    {dbUser?.tf_points ?? 0} pts
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className={styles.label}>Skills Required</p>
                            <div className={styles.skillSet}>
                                {skills.map((s) => (
                                    <p key={s} className={styles.skill}>
                                        {s}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionCol}>
                        <div
                            className={styles.statusBadge}
                            data-status={subStatus}
                        >
                            {statusInfo.label}
                        </div>

                        {!isUnlocked && (
                            <div className={styles.lockPanel}>
                                <p className={styles.lockHint}>
                                    Unlock this project to access submission.
                                </p>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => setConfirm(true)}
                                    disabled={!canAfford}
                                >
                                    {canAfford
                                        ? `Unlock for ${project.point_to_unlock} pts`
                                        : "Insufficient Points"}
                                </button>
                            </div>
                        )}

                        {isUnlocked && !isSubmitted && (
                            <div className={styles.lockPanel}>
                                <p className={styles.lockHint}>
                                    Your project is unlocked. Submit your work
                                    when ready.
                                </p>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => setSubmitOpen(true)}
                                >
                                    Submit Assignment
                                </button>
                            </div>
                        )}
                        {subStatus === "pending" && (
                            <div className={styles.donePanel}>
                                <p className={styles.doneMsg}>
                                    Your submission is under review. You will be
                                    notified once a decision is made.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {confirm && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.dialog}
                            initial={{ scale: 0.93, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.93, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className={styles.dialogTitle}>
                                Unlock Project?
                            </h3>
                            <p className={styles.dialogBody}>
                                This will deduct{" "}
                                <strong>
                                    {project.point_to_unlock} points
                                </strong>{" "}
                                from your account. You currently have{" "}
                                <strong>{dbUser?.tf_points ?? 0} points</strong>
                                .
                            </p>
                            <div className={styles.dialogActions}>
                                <button
                                    className={styles.dialogConfirm}
                                    onClick={handleUnlock}
                                    disabled={unlocking}
                                >
                                    {unlocking ? "Unlocking..." : "Yes, Unlock"}
                                </button>
                                <button
                                    className={styles.dialogCancel}
                                    onClick={() => setConfirm(false)}
                                    disabled={unlocking}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {submitOpen && !submitConfirm && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.dialog}
                            initial={{ scale: 0.93, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.93, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className={styles.dialogTitle}>
                                Submit Assignment
                            </h3>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Submission URL
                                </label>
                                <input
                                    type="url"
                                    className={styles.formInput}
                                    placeholder="https://github.com/..."
                                    value={subForm.url}
                                    onChange={(e) =>
                                        setSubForm((p) => ({
                                            ...p,
                                            url: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Upload PDF
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className={styles.fileInput}
                                    onChange={(e) =>
                                        setSubForm((p) => ({
                                            ...p,
                                            pdf: e.target.files[0],
                                        }))
                                    }
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={(e) =>
                                        setSubForm((p) => ({
                                            ...p,
                                            image: e.target.files[0],
                                        }))
                                    }
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>
                                    Comments
                                </label>
                                <textarea
                                    className={styles.formTextarea}
                                    placeholder="Any notes for the reviewer..."
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <div className={styles.dialogActions}>
                                <button
                                    className={styles.dialogConfirm}
                                    onClick={() => setSubmitConfirm(true)}
                                >
                                    Submit
                                </button>
                                <button
                                    className={styles.dialogCancel}
                                    onClick={() => setSubmitOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {submitConfirm && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.dialog}
                            initial={{ scale: 0.93, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.93, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className={styles.dialogTitle}>
                                Confirm Submission
                            </h3>
                            <p className={styles.dialogBody}>
                                Are you sure you want to submit these files?
                                This cannot be undone.
                            </p>
                            <div className={styles.dialogActions}>
                                <button
                                    className={styles.dialogConfirm}
                                    onClick={async () => {
                                        await handleSubmit();
                                        setSubmitConfirm(false);
                                        setSubmitOpen(false);
                                    }}
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Yes, Submit"}
                                </button>
                                <button
                                    className={styles.dialogCancel}
                                    onClick={() => setSubmitConfirm(false)}
                                    disabled={submitting}
                                >
                                    Go Back
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
