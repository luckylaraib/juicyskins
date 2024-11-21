// TradeURLModal.tsx
import * as React from "react";
import Button from "@mui/material/Button";
import TradeURLModalComponent from "./tradeUrlModal";

export default function TradeURLModal() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation
    setOpen(true);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <p className="font-[Roboto Flex] text-white -ml-2 text-base font-light text-left">
          Enter TradeURl
        </p>
      </Button>
      <TradeURLModalComponent open={open} onClose={handleClose} />
    </div>
  );
}
