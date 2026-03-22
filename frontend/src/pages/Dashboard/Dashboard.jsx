import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

const API_URL =
    "http://localhost:8000/api/" || "http://13.200.148.118:8000/api/";

function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const STATUS_LABEL = {
    "not submitted": "Not Submitted",
    pending: "Review Pending",
    approved: "Approved",
    rejected: "Rejected",
};

export default function Dashboard() {
    const { user, dbUser } = UserAuth();
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;
        fetch(`${API_URL}myprojects/`, {
            headers: { Email: user.email },
        })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                setSubmissions(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user?.email]);

    if (!user)
        return (
            <div className={styles.page}>
                <div className={styles.spinner} />
            </div>
        );

    const approved = submissions.filter(
        (s) => s.submission_status === "approved",
    ).length;
    const inProgress = submissions.filter(
        (s) => s.submission_status === "not submitted",
    ).length;
    const pending = submissions.filter(
        (s) => s.submission_status === "pending",
    ).length;

    return (
        <div className={styles.appcontainer}>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Dashboard</h1>
                    </div>
                    <div className={styles.pointsPill}>
                        {dbUser?.tf_points ?? 0} TF Points
                    </div>
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>
                            {submissions.length}
                        </span>
                        <span className={styles.statLabel}>Unlocked</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{inProgress}</span>
                        <span className={styles.statLabel}>In Progress</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{pending}</span>
                        <span className={styles.statLabel}>Under Review</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{approved}</span>
                        <span className={styles.statLabel}>Approved</span>
                    </div>
                </div>

                <div className={styles.sectionHeading}>
                    <h1 className={styles.sectionTitle}>My Projects</h1>
                </div>

                {loading ? (
                    <div className={styles.skeletonList}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={styles.skeleton} />
                        ))}
                    </div>
                ) : submissions.length === 0 ? (
                    <div className={styles.empty}>
                        <p>You haven't unlocked any projects yet.</p>
                        <button
                            className={styles.browseBtn}
                            onClick={() => navigate("/projects")}
                        >
                            Browse Projects
                        </button>
                    </div>
                ) : (
                    <div className={styles.projectList}>
                        {submissions.map((s, i) => (
                            <motion.div
                                key={s.submission_id}
                                className={styles.projectRow}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07, duration: 0.4 }}
                                onClick={() =>
                                    navigate(`/projects/${s.project_id}`)
                                }
                            >
                                <div className={styles.rowLeft}>
                                    <div className={styles.rowInfo}>
                                        <span className={styles.rowTitle}>
                                            {s.title}
                                        </span>
                                        <span className={styles.category}>
                                            {s.category}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.rowMeta}>
                                    <div className={styles.rowMetaItem}>
                                        <span className={styles.label}>
                                            Deadline
                                        </span>
                                        <span className={styles.metaValue}>
                                            {formatDate(s.submission_deadline)}
                                        </span>
                                    </div>
                                    <div className={styles.rowMetaItem}>
                                        <span className={styles.label}>
                                            Submitted
                                        </span>
                                        <span className={styles.metaValue}>
                                            {formatDate(s.submission_time)}
                                        </span>
                                    </div>
                                    <div className={styles.rowMetaItem}>
                                        <span className={styles.label}>
                                            Points
                                        </span>
                                        <span className={styles.metaValue}>
                                            {s.tf_points_awarded}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={styles.statusBadge}
                                    data-status={s.submission_status}
                                >
                                    {STATUS_LABEL[s.submission_status] ??
                                        s.submission_status}
                                </span>

                                <span className={styles.rowArrow}>→</span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
