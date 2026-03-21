import { useRef, useEffect, useState, useCallback } from "react";
import {
    motion,
    useScroll,
    useTransform,
    animate,
    useMotionValue,
    useSpring,
} from "framer-motion";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserAuth } from "../../context/AuthContext";
import styles from "./Home.module.css";

import marki_guy from "./assets/marki_guy.png";

const API_URL = "http://localhost:8000/api/";

function Logo({ draw, fillOpacity }) {
    return (
        <motion.svg
            style={{ width: "100%", height: "auto", overflow: "visible" }}
            viewBox="0 0 528 428"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M120.298 57.403C119.879 58.4135 119.544 59.4571 119.298 60.523C118.908 62.583 119.808 63.833 121.918 64.143C123.137 64.2697 124.363 64.3165 125.588 64.283H154.588C156.546 64.2736 158.501 64.4443 160.428 64.793C169.998 66.553 173.218 73.243 174.428 79.393C175.358 84.8506 174.96 90.4517 173.268 95.723C172.548 98.183 171.678 100.613 170.758 103.013C160.092 130.793 149.425 158.573 138.758 186.353C129.885 209.446 121.015 232.536 112.148 255.623C103.875 277.023 95.6015 298.39 87.3281 319.723C86.9781 320.643 86.5781 321.543 86.1981 322.443C85.6396 324.02 84.5839 325.373 83.1897 326.299C81.7955 327.224 80.1385 327.671 78.4681 327.573H76.9982L24.7882 327.513C23.3201 327.642 21.841 327.492 20.4282 327.073C18.9182 326.503 18.1882 325.463 18.6482 323.943C19.158 322.31 19.8001 320.721 20.5681 319.193C25.9681 308.193 31.4281 297.193 36.8281 286.193C49.7415 259.913 62.6382 233.63 75.5182 207.343C86.0782 185.776 96.6282 164.206 107.168 142.633C113.048 130.723 118.998 118.723 124.898 106.723C125.474 105.642 125.958 104.514 126.348 103.353C126.704 102.419 126.681 101.382 126.283 100.464C125.885 99.5467 125.144 98.8213 124.218 98.443C122.225 97.4908 120.091 96.8661 117.898 96.593C114.378 96.063 110.838 95.983 107.278 95.793C103.729 95.6895 100.201 95.1999 96.7582 94.333C92.815 93.3468 89.1964 91.3515 86.2582 88.543C81.2582 83.593 79.5381 77.543 80.5681 70.733C81.009 67.6925 81.984 64.754 83.4481 62.053C89.7981 50.443 95.7082 38.593 102.778 27.393C105.188 23.5492 107.801 19.8372 110.608 16.273C113.166 12.9749 116.172 10.0501 119.538 7.583C125.728 3.713 126.538 2.69302 134.058 1.04302C137.688 0.382619 141.369 0.047954 145.058 0.0430247H379.988C381.859 -0.108286 383.741 0.140547 385.508 0.773005C387.028 1.23301 387.618 3.07303 387.278 4.51303C387.021 5.46198 386.686 6.38836 386.278 7.28301C384.658 11.123 383.008 14.953 381.368 18.773C381.128 19.333 380.848 19.883 380.608 20.443C380.215 21.4865 379.498 22.3766 378.562 22.9831C377.626 23.5895 376.521 23.8804 375.408 23.813C374.678 23.813 373.938 23.813 373.198 23.813C338.398 23.813 313.538 23.813 278.728 23.813C234.481 23.813 190.235 23.7764 145.988 23.703C143.908 23.703 141.818 23.703 139.738 23.773C135.508 23.773 131.508 27.263 129.668 32.563"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: draw, fillOpacity }}
            />
            <motion.path
                d="M265.891 193.882C263.287 193.883 260.725 194.534 258.437 195.778C256.149 197.021 254.208 198.817 252.791 201.002L251.301 203.302C240.231 220.662 229.301 238.122 217.621 255.072C210.041 266.072 202.181 276.882 193.561 287.072C181.951 300.812 168.361 312.072 151.971 319.762C144.385 323.256 136.277 325.486 127.971 326.362C117.821 327.532 109.031 327.082 98.871 327.062C98.1344 327.066 97.4008 326.968 96.6909 326.772C96.1636 326.599 95.7217 326.232 95.4544 325.746C95.1871 325.259 95.1144 324.69 95.251 324.152C95.8297 322.113 96.5275 320.109 97.341 318.152C98.491 315.212 98.871 314.682 99.851 312.152C102.131 306.272 103.211 305.012 108.611 305.012H125.411C134.541 305.012 141.131 302.112 148.021 297.742C149.981 296.505 151.876 295.17 153.701 293.742C162.755 286.402 170.953 278.066 178.141 268.892C189.851 254.242 199.001 238.072 206.651 221.012C223.281 183.892 238.481 146.162 253.781 108.492C257.881 98.3917 262.041 88.3117 266.161 78.2217C267.082 75.8154 268.266 73.5182 269.691 71.3717C272.693 66.9705 277.163 63.7804 282.301 62.3717C285.727 61.4014 289.27 60.91 292.831 60.9117H360.101C362.181 60.9117 364.271 60.9117 366.351 60.9117C367.771 60.9018 369.161 60.5044 370.372 59.7625C371.582 59.0206 372.568 57.9623 373.221 56.7017C373.831 55.6417 374.291 54.4917 374.791 53.3817C378.791 44.4417 382.791 35.4917 386.861 26.5717C389.391 20.9917 392.001 15.4517 394.581 9.90172C394.891 9.23172 395.201 8.56172 395.581 7.90172C396.397 6.23627 397.687 4.84825 399.287 3.911C400.888 2.97375 402.729 2.52881 404.581 2.63174C416.101 2.73174 427.581 2.72174 439.151 2.73174C441.24 2.7062 443.318 3.04458 445.291 3.73174C449.111 5.11174 450.571 7.89175 449.591 11.8617C448.985 13.978 448.082 15.998 446.911 17.8617C444.021 22.8617 441.151 27.8617 438.261 32.8617C428.614 49.5284 418.948 66.1651 409.261 82.7717C407.926 85.1112 406.457 87.3716 404.861 89.5417C398.691 97.8017 392.211 99.7017 379.931 99.7017C371.061 99.7017 371.441 99.7017 366.601 99.7017C347.971 99.7017 339.291 99.8517 320.661 99.9217C316.859 99.9173 313.073 100.415 309.401 101.402C303.061 103.122 297.577 107.121 294.001 112.632C292.415 114.965 291.1 117.471 290.081 120.102C287.081 127.872 284.141 135.662 281.191 143.452C280.925 144.139 280.708 144.844 280.541 145.562C279.991 148.072 281.031 149.562 283.661 149.882C284.88 150.003 286.106 150.05 287.331 150.022L317.851 149.962C322.631 149.962 327.411 149.962 332.191 149.962C333.543 149.871 334.899 150.034 336.191 150.442C337.191 150.912 337.821 151.642 337.461 152.712C336.901 154.332 336.241 155.922 335.541 157.482C333.021 163.062 330.431 168.612 327.931 174.202C325.931 178.572 324.141 182.972 322.241 187.362C321.889 188.274 321.485 189.166 321.031 190.032C320.448 191.191 319.559 192.166 318.461 192.855C317.363 193.544 316.097 193.92 314.801 193.942C313.801 193.942 312.801 193.942 311.861 193.942H288.691"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: draw, fillOpacity }}
            />
            <motion.path
                d="M485.122 25.3527H480.592V5.61267H473.672V1.72266H492.052V5.59265H485.122V25.3527Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                style={{ pathLength: draw, fillOpacity }}
            />
            <motion.path
                d="M515.62 25.3527H511.56L504.07 5.55264H504L504.38 25.3527H499.84V1.72266H507.11L513.54 19.2527H513.66L519.96 1.72266H527.39V25.3326H522.85L523.23 5.43265H523.07L515.62 25.3527Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                style={{ pathLength: draw, fillOpacity }}
            />
        </motion.svg>
    );
}

function CategoriesSection() {
    const numCards = 6;
    const spacing = 150;
    const totalScrollHeight = numCards * spacing - 150;

    const localScrollY = useMotionValue(0);
    const localCategoriesScroll = useSpring(localScrollY, {
        stiffness: 50,
        damping: 20,
        mass: 0.5,
    });

    const containerY = useTransform(localCategoriesScroll, (y) => -y);
    const containerRotateY = useTransform(
        localCategoriesScroll,
        (y) => -y * (360 / 1200),
    );

    const sectionRef = useRef(null);
    const isActiveRef = useRef(false);
    const scrollProgressRef = useRef(0);

    const categoryCards = [
        { name: "DESIGN", image: marki_guy },
        { name: "WEB", image: marki_guy },
        { name: "PUBLICITY", image: marki_guy },
        { name: "MARKETING", image: marki_guy },
        { name: "OZONE", image: marki_guy },
        { name: "EVENTS", image: marki_guy },
    ];

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isActiveRef.current = entry.isIntersecting;
            },
            { threshold: 0.3 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleWheel = useCallback(
        (e) => {
            if (!isActiveRef.current) return;

            const atStart = scrollProgressRef.current <= 0 && e.deltaY < 0;
            const atEnd =
                scrollProgressRef.current >= totalScrollHeight && e.deltaY > 0;

            if (atStart || atEnd) return;

            e.preventDefault();
            e.stopPropagation();

            scrollProgressRef.current = Math.max(
                0,
                Math.min(
                    totalScrollHeight,
                    scrollProgressRef.current + e.deltaY,
                ),
            );
            localScrollY.set(scrollProgressRef.current);
        },
        [localScrollY, totalScrollHeight],
    );
    const touchStartY = useRef(0);
    const handleTouchStart = useCallback((e) => {
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchMove = useCallback(
        (e) => {
            if (!isActiveRef.current) return;
            const delta = touchStartY.current - e.touches[0].clientY;
            touchStartY.current = e.touches[0].clientY;

            const atStart = scrollProgressRef.current <= 0 && delta < 0;
            const atEnd =
                scrollProgressRef.current >= totalScrollHeight && delta > 0;
            if (atStart || atEnd) return;

            e.preventDefault();
            scrollProgressRef.current = Math.max(
                0,
                Math.min(totalScrollHeight, scrollProgressRef.current + delta),
            );
            localScrollY.set(scrollProgressRef.current);
        },
        [localScrollY, totalScrollHeight],
    );

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        el.addEventListener("wheel", handleWheel, { passive: false });
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
        };
    }, [handleWheel, handleTouchStart, handleTouchMove]);

    return (
        <div ref={sectionRef} className={styles.helixSection}>
            <div className={styles.helixProgress}>
                <motion.div
                    className={styles.helixProgressBar}
                    style={{
                        scaleY: useTransform(
                            localCategoriesScroll,
                            [0, totalScrollHeight],
                            [0, 1],
                        ),
                    }}
                />
            </div>

            <div className={styles.helixViewport}>
                <div className={styles.backgroundGlow}>
                    <h1>Explore the Various Categories</h1>
                </div>

                <motion.div
                    className={styles.helix}
                    style={{
                        y: containerY,
                        rotateY: containerRotateY,
                    }}
                >
                    {categoryCards.map((card, i) => {
                        const yPos = i * spacing;
                        const rotateY = i * 45;
                        return (
                            <div
                                key={i}
                                className={styles.cardWrapper}
                                style={{
                                    transform: `translateY(${yPos}px) rotateY(${rotateY}deg) translateZ(350px)`,
                                }}
                            >
                                <motion.div
                                    className={styles.card}
                                    whileHover={{
                                        scale: 1.15,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    <div className={styles.cardGlare} />
                                    <div className={styles.cardContent}>
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className={styles.cardImage}
                                        />
                                        <span className={styles.cardTitle}>
                                            {card.name}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}

export default function Home() {
    const wrapRef = useRef(null);
    const navigate = useNavigate();
    const { user, googleSignIn } = UserAuth();

    const [latestProjects, setLatestProjects] = useState([]);
    const [introComplete, setIntroComplete] = useState(false);

    const introDraw = useMotionValue(0);
    const introFill = useMotionValue(0);
    const introBlackBg = useMotionValue(1);
    const introLogoX = useMotionValue("0");
    const introLogoY = useMotionValue("0");
    const introLogoScale = useMotionValue(1);
    const introLogoOpacity = useMotionValue(1);

    const { scrollYProgress } = useScroll({
        target: wrapRef,
        offset: ["start start", "end end"],
    });
    const moveTitle = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const opacityTitle = useTransform(scrollYProgress, [0, 0.9], [1, 0.3]);
    const rawCoverY = useTransform(
        scrollYProgress,
        [0.14, 0.25],
        ["100%", "0%"],
    );
    const coverY = useSpring(rawCoverY, {
        stiffness: 120,
        damping: 20,
        mass: 0.5,
    });

    useEffect(() => {
        fetch(`${API_URL}latest-projs/`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setLatestProjects(data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const seq = async () => {
            await animate(introDraw, 1, { duration: 1.4, ease: "easeInOut" });
            await animate(introFill, 1, { duration: 0.5, ease: "easeIn" });
            await new Promise((r) => setTimeout(r, 200));
            await Promise.all([
                animate(introBlackBg, 0, { duration: 0.9, ease: "easeInOut" }),
                animate(introLogoScale, 0.18, {
                    duration: 0.9,
                    ease: "easeInOut",
                }),
                animate(introLogoOpacity, 0, {
                    duration: 0.7,
                    ease: "easeIn",
                    delay: 0.2,
                }),
                animate(introLogoX, "-45vw", {
                    duration: 0.9,
                    ease: "easeInOut",
                }),
                animate(introLogoY, "-45vh", {
                    duration: 0.9,
                    ease: "easeInOut",
                }),
            ]);

            document.body.style.overflow = "";
            setIntroComplete(true);
        };

        seq();
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleGetStarted = async () => {
        if (user) {
            navigate("/profile");
        } else {
            try {
                await googleSignIn();
                toast.success("Signed in successfully!");
                navigate("/profile");
            } catch (err) {
                toast.error("Sign in failed.");
            }
        }
    };

    return (
        <>
            <motion.div
                className={styles.introOverlay}
                style={{ opacity: introBlackBg }}
                pointerEvents={introComplete ? "none" : "all"}
            >
                <motion.div
                    className={styles.introLogoWrap}
                    style={{
                        x: introLogoX,
                        y: introLogoY,
                        scale: introLogoScale,
                        opacity: introLogoOpacity,
                    }}
                >
                    <Logo draw={introDraw} fillOpacity={introFill} />
                </motion.div>
            </motion.div>

            <div ref={wrapRef} className={styles.appcontainer}>
                <div className={styles.sticky}>
                    <div className={styles.bg}>
                        <img
                            src="https://i.pinimg.com/1200x/3c/8d/12/3c8d126ef524fc481af1172642884038.jpg"
                            alt=""
                            className={styles.bgImage}
                        />
                        <div className={styles.bgOverlay} />
                    </div>

                    <motion.div
                        className={styles.titleBlock}
                        initial={{ opacity: 0, y: 24 }}
                        animate={introComplete ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        style={{ scale: moveTitle, opacity: opacityTitle }}
                    >
                        <h1 className={styles.title}>Techfest Projects</h1>
                        <motion.button
                            className={styles.getStarted}
                            onClick={handleGetStarted}
                            whileTap={{ scale: 0.97 }}
                        >
                            {user ? "Go to Profile →" : "Get Started →"}
                        </motion.button>
                    </motion.div>

                    <motion.div className={styles.cover} style={{ y: coverY }}>
                        <CategoriesSection />

                        <section className={styles.explore}>
                            <div className={styles.exploreHeader}>
                                <motion.h1
                                    className={styles.exploreTitle}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    Explore Projects
                                </motion.h1>
                                <motion.p
                                    style={{ color: "white", margin: 0 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    Latest Projects
                                </motion.p>
                            </div>

                            <div className={styles.projectGrid}>
                                {latestProjects.length > 0
                                    ? latestProjects.map((p, i) => (
                                          <motion.div
                                              key={p.project_id}
                                              className={styles.projectCard}
                                              initial={{ opacity: 0, y: 50 }}
                                              whileInView={{ opacity: 1, y: 0 }}
                                              viewport={{
                                                  once: true,
                                                  margin: "-60px",
                                              }}
                                              transition={{
                                                  duration: 0.55,
                                                  delay: i * 0.13,
                                                  ease: [0.22, 1, 0.36, 1],
                                              }}
                                              whileHover={{
                                                  y: -8,
                                                  transition: { duration: 0.2 },
                                              }}
                                              onClick={() =>
                                                  navigate(
                                                      `/projects/${p.project_id}`,
                                                  )
                                              }
                                          >
                                              <div className={styles.cardTop}>
                                                  <h1
                                                      className={
                                                          styles.cardTitle
                                                      }
                                                  >
                                                      {p.title}
                                                  </h1>
                                                  <h1
                                                      className={
                                                          styles.cardCategory
                                                      }
                                                  >
                                                      {p.category}
                                                  </h1>
                                              </div>

                                              <p className={styles.cardDesc}>
                                                  {p.description}
                                              </p>
                                              <div
                                                  className={styles.cardFooter}
                                              >
                                                  <p
                                                      className={
                                                          styles.cardPoints
                                                      }
                                                  >
                                                      +{p.tf_points_awarded} pts
                                                  </p>
                                                  <p
                                                      className={
                                                          styles.cardUnlock
                                                      }
                                                  >
                                                      🔒 {p.point_to_unlock}
                                                  </p>
                                              </div>
                                          </motion.div>
                                      ))
                                    : [1, 2, 3].map((i) => (
                                          <div
                                              key={i}
                                              className={styles.cardSkeleton}
                                          />
                                      ))}
                            </div>

                            <motion.div
                                className={styles.viewAllWrap}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    className={styles.viewAllBtn}
                                    onClick={() => navigate("/projects")}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    View All Projects →
                                </motion.button>
                            </motion.div>
                        </section>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
