"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/analytics-browser";

export default function AmplitudeAnalytics() {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
            amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, {
                defaultTracking: true,
            });
        }
    }, []);

    return null;
}
