import React, { Suspense, useState, useEffect } from "react";
import { VueWrapper } from "./VueWrapper";

interface HabitTrackerWrapperProps {
  fallback?: React.ReactNode;
}

export const HabitTrackerWrapper: React.FC<HabitTrackerWrapperProps> = ({
  fallback = <div>Loading Habit Tracker...</div>,
}) => {
  const [VueComponent, setVueComponent] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadVueComponent = async () => {
      try {
        // Dynamically import the Vue component from the micro-frontend
        const module = await import("habitTracker/app/bootstrap");
        setVueComponent(() => module.default);
      } catch (err) {
        console.error("Failed to load habit tracker:", err);
        setError(err as Error);
      }
    };

    loadVueComponent();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>Error loading Habit Tracker</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  console.log("VueComponent", VueComponent);

  if (!VueComponent) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      <VueWrapper component={VueComponent} />
    </Suspense>
  );
};
