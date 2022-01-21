import React from "react";
import AutoHideAlert, { alertRef } from "./AutoHideAlert.js";
import MintModal, { modalRef } from "./MintModal.js";
import { ThemeProvider } from "@mui/material";
import { theme } from "../styles/theme.js";
import Mint from "./Mint.js";

export const App = () => {
    return <ThemeProvider theme={theme}>
        <div>
            <Mint />
            <AutoHideAlert ref={alertRef} />
            <MintModal ref={modalRef} />
        </div>
    </ThemeProvider>
}
