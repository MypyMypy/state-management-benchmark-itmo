import React from "react";
import { MainLayout } from "@/app/layouts/MainLayout";
import { AppRouter } from "@/app/providers/router";
import { BrowserRouter } from "react-router-dom";
import { ReduxProvider } from "@/app/providers/store";
import { PerfPanel } from "@/widgets/perf/ui/PerfPanel";

export const App: React.FC = () => (
  <BrowserRouter>
    <ReduxProvider>
      <MainLayout>
        <AppRouter />
      </MainLayout>
      {/* PerfPanel теперь всегда доступен; можно отключить через ?perf=off */}
      {(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("perf") === "off") return null;
        return <PerfPanel />;
      })()}
    </ReduxProvider>
  </BrowserRouter>
);

export default App;
