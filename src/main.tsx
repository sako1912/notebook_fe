import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function initMocks() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    return worker.start({
      onUnhandledRequest: (request, print) => {
        // /api/upload 요청은 MSW가 처리하지 않고 실제 서버로 전달
        if (request.url.includes("/api/upload")) {
          return;
        }
      },
    });
  }
  return Promise.resolve();
}

initMocks().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
