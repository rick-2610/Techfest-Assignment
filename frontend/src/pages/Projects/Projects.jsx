import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./Projects.module.css";

const API_URL =
    "http://localhost:8000/api/" || "http://13.200.148.118:8000/api/";

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.11, delayChildren: 0.3 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 52, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
};

const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

function formatDeadline(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}projects/`)
            .then((r) => {
                if (!r.ok) throw new Error("Failed to fetch");
                return r.json();
            })
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.appcontainer}>
            <motion.header
                className={styles.header}
                initial="hidden"
                animate="show"
                variants={titleVariants}
            >
                <h1 className={styles.title}>Projects</h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    Pick a project to get started
                </motion.p>
            </motion.header>

            <div className={styles.body}>
                {loading && (
                    <div className={styles.stateMsg}>
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className={styles.skeleton} />
                        ))}
                    </div>
                )}

                {error && (
                    <p className={styles.errorMsg}>
                        Could not load projects — {error}
                    </p>
                )}

                {!loading && !error && projects.length === 0 && (
                    <p className={styles.stateText}>
                        No projects available yet.
                    </p>
                )}

                {!loading && !error && projects.length > 0 && (
                    <motion.div
                        className={styles.grid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {projects.map((p) => (
                            <motion.div
                                key={p.project_id}
                                className={styles.card}
                                variants={cardVariants}
                                whileHover={{
                                    y: -6,
                                    transition: { duration: 0.22 },
                                }}
                            >
                                <div className={styles.cardTop}>
                                    <h1 className={styles.cardTitle}>
                                        {p.title}
                                    </h1>

                                    <h1 className={styles.cardCategory}>
                                        {p.category}
                                    </h1>
                                </div>

                                <p className={styles.cardDesc}>
                                    {p.description}
                                </p>

                                <div className={styles.divider} />

                                <div className={styles.skillsRow}>
                                    <span className={styles.fieldLabel}>
                                        Skills
                                    </span>
                                    <div className={styles.skillPills}>
                                        {p.skills_required
                                            .split(",")
                                            .map((s) => (
                                                <span
                                                    key={s.trim()}
                                                    className={styles.pill}
                                                >
                                                    {s.trim()}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                <div className={styles.statsRow}>
                                    <div className={styles.stat}>
                                        <span className={styles.statValue}>
                                            {p.tf_points_awarded}
                                        </span>
                                        <span className={styles.statLabel}>
                                            Points Awarded
                                        </span>
                                    </div>
                                    <div className={styles.statDivider} />
                                    <div className={styles.statDivider} />
                                    <div className={styles.stat}>
                                        <span className={styles.statValue}>
                                            {formatDeadline(
                                                p.submission_deadline,
                                            )}
                                        </span>
                                        <span className={styles.statLabel}>
                                            Deadline
                                        </span>
                                    </div>
                                </div>

                                <motion.button
                                    className={styles.viewBtn}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() =>
                                        navigate(`/projects/${p.project_id}`)
                                    }
                                >
                                    View Details →
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
