"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    calculateContrastFromString,
    meetsWcagAa,
    formatContrastRatio
} from "@/lib/utils/color/contrast";

interface ContrastResult {
    id: string;
    label: string;
    fgColor: string;
    bgColor: string;
    ratio: number | null;
    passes: boolean;
    isLargeText: boolean;
}

export const ContrastChecker = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [results, setResults] = useState<ContrastResult[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    const checkContrast = () => {
        if (!containerRef.current) return;

        setIsChecking(true);
        const elementsToAnalyze = containerRef.current.querySelectorAll("[data-contrast-check]");

        const newResults: ContrastResult[] = [];

        elementsToAnalyze.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const styles = window.getComputedStyle(htmlEl);
            const fgColor = styles.color;
            let bgColor = styles.backgroundColor;

            // If background is transparent, try to get the parent's background color
            if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
                let parent = htmlEl.parentElement;
                while (parent) {
                    const parentStyles = window.getComputedStyle(parent);
                    if (parentStyles.backgroundColor !== "rgba(0, 0, 0, 0)" && parentStyles.backgroundColor !== "transparent") {
                        bgColor = parentStyles.backgroundColor;
                        break;
                    }
                    parent = parent.parentElement;
                }
            }

            const isLargeText = parseInt(styles.fontSize, 10) >= 18; // >18px roughly (14pt bold or 18pt normal)
            const ratio = calculateContrastFromString(fgColor, bgColor);
            const passes = ratio ? meetsWcagAa(ratio, isLargeText) : false;

            newResults.push({
                id: htmlEl.id || Math.random().toString(36).substring(7),
                label: htmlEl.getAttribute("data-contrast-check") || "Unknown element",
                fgColor,
                bgColor,
                ratio,
                passes,
                isLargeText
            });
        });

        setResults(newResults);
        setIsChecking(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">WCAG Contrast Checker</h1>
                    <p className="text-muted-foreground mt-2">
                        Verifies color contrast ratios for UI components in the current theme.
                        Highlights "black on black" issues in dark mode.
                    </p>
                </div>
                <button
                    onClick={checkContrast}
                    disabled={isChecking}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                    {isChecking ? "Analyzing DOM..." : "Run Contrast Check"}
                </button>
            </div>

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className={`p-4 rounded-lg border ${result.passes ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-foreground">{result.label}</h3>
                                <span className={`px-2 py-1 text-xs font-bold rounded ${result.passes ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                                    {result.passes ? 'PASS (AA)' : 'FAIL'}
                                </span>
                            </div>

                            <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Ratio:</span>
                                    <span className={`font-mono font-bold ${!result.passes ? 'text-destructive' : ''}`}>
                                        {result.ratio ? formatContrastRatio(result.ratio) : "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Text Color:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: result.fgColor }} />
                                        <span className="font-mono text-xs">{result.fgColor}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Background:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: result.bgColor }} />
                                        <span className="font-mono text-xs">{result.bgColor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* The DOM to be analyzed */}
            <div ref={containerRef} className="space-y-12 border border-border rounded-xl p-8 bg-background relative overflow-hidden">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6 pb-2 border-b border-border">
                    UI Elements Test Area
                </h2>

                {/* Base Typography */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground opacity-50 uppercase tracking-wider text-sm">Typography (Background)</h3>
                    <div className="p-6 bg-background rounded-lg border border-border">
                        <h1 data-contrast-check="H1 on Background" className="text-4xl font-serif font-bold text-foreground mb-4">
                            Heading 1 - The quick brown fox
                        </h1>
                        <p data-contrast-check="Paragraph on Background" className="text-base text-muted-foreground">
                            This is a standard paragraph using the muted-foreground color on the default background. It should have sufficient contrast to be readable.
                        </p>
                    </div>
                </section>

                {/* Interactive Elements */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground opacity-50 uppercase tracking-wider text-sm">Buttons & Interactive</h3>
                    <div className="flex flex-wrap gap-4 p-6 bg-background rounded-lg border border-border">
                        <button data-contrast-check="Primary Button" className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
                            Primary Button
                        </button>
                        <button data-contrast-check="Secondary Button" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium">
                            Secondary Button
                        </button>
                        <button data-contrast-check="Accent Button" className="px-4 py-2 bg-accent text-accent-foreground rounded-md font-medium">
                            Accent Button
                        </button>
                        <button data-contrast-check="Destructive Button" className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium">
                            Destructive Button
                        </button>
                    </div>
                </section>

                {/* Cards */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground opacity-50 uppercase tracking-wider text-sm">Cards & Containers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-background rounded-lg border border-border bg-muted/20">
                        <div className="bg-card text-card-foreground shadow-card p-6 rounded-xl border border-border">
                            <h4 data-contrast-check="Card Title" className="text-lg font-bold mb-2">Card Title Element</h4>
                            <p data-contrast-check="Card Body Text" className="text-muted-foreground text-sm">
                                This is the body text inside a card component. Cards often have a slightly different background color than the main app background, especially in dark mode.
                            </p>
                        </div>

                        <div className="bg-popover text-popover-foreground shadow-popover p-6 rounded-xl border border-border">
                            <h4 data-contrast-check="Popover Title" className="text-lg font-bold mb-2">Popover Container</h4>
                            <p data-contrast-check="Popover Body Text" className="text-muted-foreground text-sm">
                                Popovers like dropdowns and tooltips use the popover variables.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Form Inputs */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground opacity-50 uppercase tracking-wider text-sm">Form Inputs</h3>
                    <div className="max-w-md p-6 bg-card rounded-lg border border-border space-y-4">
                        <div className="space-y-1.5">
                            <label data-contrast-check="Form Label" className="text-sm font-medium text-foreground">Email Address</label>
                            <input
                                data-contrast-check="Input Field Text"
                                type="text"
                                placeholder="Enter your email..."
                                defaultValue="test@example.com"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <p data-contrast-check="Input Help Text" className="text-xs text-muted-foreground">We'll never share your email with anyone else.</p>
                        </div>
                    </div>
                </section>

                {/* Status Alerts / Badges */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground opacity-50 uppercase tracking-wider text-sm">Status & Alerts</h3>
                    <div className="flex flex-wrap gap-4 p-6 bg-background rounded-lg border border-border">
                        <div data-contrast-check="Success Alert" className="px-4 py-3 bg-success/20 border border-success/30 text-success rounded-md w-full max-w-md">
                            <p className="font-semibold mb-1">Success Alert</p>
                            <p className="text-sm opacity-90">Your changes have been saved successfully.</p>
                        </div>
                        <div data-contrast-check="Warning Alert" className="px-4 py-3 bg-warning/20 border border-warning/30 text-warning rounded-md w-full max-w-md">
                            <p className="font-semibold mb-1">Warning Alert</p>
                            <p className="text-sm opacity-90">Please complete your profile information.</p>
                        </div>
                        <div data-contrast-check="Info Alert" className="px-4 py-3 bg-info/20 border border-info/30 text-info rounded-md w-full max-w-md">
                            <p className="font-semibold mb-1">Information Alert</p>
                            <p className="text-sm opacity-90">A new software update is available.</p>
                        </div>
                    </div>
                </section>

                {/* Sidebar Context */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground opacity-50 uppercase tracking-wider text-sm">Sidebar Context</h3>
                    <div className="flex h-48 border border-border rounded-lg overflow-hidden">
                        <div className="w-64 bg-sidebar text-sidebar-foreground p-4 border-r border-sidebar-border">
                            <h4 data-contrast-check="Sidebar Header" className="font-bold text-sm uppercase tracking-wider mb-4 opacity-70">Navigation</h4>
                            <ul className="space-y-2">
                                <li data-contrast-check="Sidebar Active Item" className="px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md font-medium text-sm">
                                    Dashboard (Active)
                                </li>
                                <li data-contrast-check="Sidebar Inactive Item" className="px-3 py-2 hover:bg-sidebar-accent/50 text-sidebar-foreground rounded-md font-medium text-sm">
                                    Settings (Inactive)
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-background p-6 flex items-center justify-center">
                            <p className="text-muted-foreground">Main Content Area</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};
