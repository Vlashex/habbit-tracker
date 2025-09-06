import React, { useEffect, useRef } from "react";
import { createApp } from "vue";

interface VueWrapperProps {
  component: any;
  props?: Record<string, any>;
}

export const VueWrapper: React.FC<VueWrapperProps> = ({
  component,
  props = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && component) {
      // Clean up previous Vue app if it exists
      if (appRef.current) {
        appRef.current.unmount();
      }

      // Create new Vue app
      const app = createApp(component, props);
      appRef.current = app;
      app.mount(containerRef.current);
    }

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component, props]);

  return <div ref={containerRef} />;
};
