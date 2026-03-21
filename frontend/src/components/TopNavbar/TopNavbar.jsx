import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserAuth } from "../../context/AuthContext";
import styles from "./TopNavbar.module.css";

import Tf_logo from "./assets/Tf_logo.svg";

export default function Navbar() {
    const { user, dbUser, googleSignIn } = UserAuth();
    const navigate = useNavigate();

    const handleAuth = async () => {
        if (user) {
            navigate("/profile");
        } else {
            try {
                await googleSignIn();
                toast.success("Signed in!");
                navigate("/profile");
            } catch (err) {
                console.error(err);
                toast.error("Sign in failed.");
            }
        }
    };

    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <button className={styles.logo} onClick={() => navigate("/")}>
                <img src={Tf_logo} alt="Tf_logo" />
            </button>

            <div className={styles.centerElements}>
                <button
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/projects")}
                >
                    <h1 style={{ color: "white" }}>Projects</h1>
                </button>
                <button
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/dashboard")}
                >
                    <h1 style={{ color: "white" }}>Dashboard</h1>
                </button>
            </div>

            <div className={styles.signIn}>
                {user ? (
                    <button className={styles.profileBtn} onClick={handleAuth}>
                        <img
                            src={`http://localhost:8000/${dbUser?.pfp}` || null}
                            alt="avatar"
                            className={styles.avatar}
                        />
                        <h1>Profile</h1>
                    </button>
                ) : (
                    <motion.button
                        className={styles.signInBtn}
                        onClick={handleAuth}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Sign In
                    </motion.button>
                )}
            </div>
        </motion.nav>
    );
}
