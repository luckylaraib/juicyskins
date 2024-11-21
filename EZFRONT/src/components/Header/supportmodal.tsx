import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#3D3A40",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal() {
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
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Live Gaming</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

type Props = {
  btntext: string;
};

export default function SupportModal({ btntext }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation
    setOpen(true);
  };
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation
    setOpen(false);
  };

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation within the modal content
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <p className="font-[Roboto Flex] -ml-2 text-base font-normal text-white -mt-2">
          {btntext}
        </p>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            height: 220,
            width: 300,
            borderRadius: 0,
            padding: 3,
          }}
          onClick={handleModalContentClick}
        >
          <h2
            id="parent-modal-title"
            className="text-4xl font-bold capitalize mb-4 text-white"
          >
            Support:
          </h2>
          <p className="text-white">
            For Issues please contact our Support on Discord:{" "}
            <a href="" className="text-blue-500">
              JuicySkinsSupport
            </a>{" "}
            or send us an E-Mail with the Jackpot Number to:{" "}
            <a href="mailto:JuicySkinsMOD@gmail.com" className="text-blue-500">
              JuicySkinsMOD@gmail.com
            </a>
          </p>
          <div
            className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-y-150  duration-300"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width={20}
              height={20}
              viewBox="0 0 50 50"
              fill="white"
              className="hover:fill-red-700"
            >
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
            </svg>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
