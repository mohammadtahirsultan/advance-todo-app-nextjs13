import { ContextProvider } from "../components/clients";
import "../styles/app.scss";
import Header from "./header";

export const metadata = {
  title: "Todo Full Stack - Next JS App",
  description: "This is a Todo App Project made with Next.js 13 and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <ContextProvider>
          <>
            <Header />
            {children}
          </>
        </ContextProvider>
      </body>
    </html>
  );
}
