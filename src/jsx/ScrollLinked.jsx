"use client";
import React from "react";

import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";
import { useRef } from "react";

export default function ScrollLinked() {
    const ref = useRef(null);
    const { scrollXProgress } = useScroll({ container: ref });
    const maskImage = useScrollOverflowMask(scrollXProgress);

    return (
        <div id="example">
            {/* Circular Progress Indicator */}
            <svg id="progress" width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="30"
                    className="indicator"
                    style={{ pathLength: scrollXProgress }}
                />
            </svg>

            {/* Scrollable List */}
            <motion.ul ref={ref} style={{ maskImage }}>
                <li style={{ background: "#ff0088" }}></li>
                <li style={{ background: "#dd00ee" }}></li>
                <li style={{ background: "#9911ff" }}></li>
                <li style={{ background: "#0d63f8" }}></li>
                <li style={{ background: "#0cdcf7" }}></li>
                <li style={{ background: "#4ff0b7" }}></li>
            </motion.ul>

            <StyleSheet />
        </div>
    );
}

// Function to create the scroll mask effect
function useScrollOverflowMask(scrollXProgress) {
    const maskImage = useMotionValue(
        `linear-gradient(90deg, transparent, black 20%, black 80%, transparent)`
    );

    useMotionValueEvent(scrollXProgress, "change", (value) => {
        if (value === 0) {
            animate(maskImage, `linear-gradient(90deg, black, black 20%, black 80%, transparent)`);
        } else if (value === 1) {
            animate(maskImage, `linear-gradient(90deg, transparent, black 20%, black 80%, black)`);
        } else if (scrollXProgress.getPrevious() === 0 || scrollXProgress.getPrevious() === 1) {
            animate(maskImage, `linear-gradient(90deg, transparent, black 20%, black 80%, transparent)`);
        }
    });

    return maskImage;
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style>{`
            #example {
              width: 100vw;
              max-width: 400px;
              position: relative;
            }

            #example #progress {
                position: absolute;
                top: -65px;
                left: -15px;
                transform: rotate(-90deg);
            }

            #example .bg {
                stroke: var(--layer);
            }

            #example #progress circle {
                stroke-dashoffset: 0;
                stroke-width: 10%;
                fill: none;
            }

            #progress .indicator {
                stroke: var(--accent);
            }

            #example ul {
                display: flex;
                list-style: none;
                height: 220px;
                overflow-x: scroll;
                padding: 20px 0;
                flex: 0 0 600px;
                margin: 0 auto;
                gap: 20px;
            }

            #example ::-webkit-scrollbar {
                height: 5px;
                width: 5px;
                background: #fff3;
                -webkit-border-radius: 1ex;
            }

            #example ::-webkit-scrollbar-thumb {
                background: var(--accent);
                -webkit-border-radius: 1ex;
            }

            #example ::-webkit-scrollbar-corner {
                background: #fff3;
            }

            #example li {
                flex: 0 0 200px;
                background: var(--accent);
            }
        `}</style>
    );
}
