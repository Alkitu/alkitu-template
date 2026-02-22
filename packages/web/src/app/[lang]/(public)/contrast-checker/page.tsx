import React from "react";
import { ContrastChecker } from "@/components/dev/contrast-checker";

export const metadata = {
    title: "Contrast Checker - Dev Tools",
    description: "Developer tool to check UI contrast ratios in the current theme.",
};

export default function ContrastCheckerPage() {
    return (
        <div className="min-h-screen bg-background border-t border-border mt-1">
            <div className="container mx-auto py-12">
                <ContrastChecker />
            </div>
        </div>
    );
}
