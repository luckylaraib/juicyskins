import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "500px",
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflowY: "auto",
  p: 4,
};

type Prop = {
  handleOpen: any;
  open: boolean;
  handleClose: any;
};
export default function BasicModal({ handleOpen, handleClose, open }: Prop) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="font-bold text-center text-[24px] ">
            Terms of Service
          </h1>
          <br />
          <br />
          <p>
            <b>Legal Notice:</b> <br />
            These Terms and Conditions apply to all services provided by
            Juicyskins.com, including any website with a domain name ending
            "Juicyskins.com" and any email and other correspondence between us.
          </p>
          <br />
          <h1>
            <b>Bet Participation:</b>{" "}
          </h1>
          <p>
            {" "}
            By placing a bet on Juicyskins.com, you confirm that you are 18
            years of age or over, of sound mind and capable of taking
            responsibility for your own actions. We do not guarantee the service
            or its quality, completeness or accuracy. We reserve the right to
            suspend and/or cancel any bet/wager at any time. If a platform is
            suspended, any bets entered will be on hold. We also have a rule
            system to avoid problems. If you win a coinflip, you have 10 minutes
            to accept the trade. If you don't accept the trade within 10
            minutes, you will not be eligible for a full refund.
          </p>
          <br />
          <h1>
            {" "}
            <b>Deposit, Withdrawal or Lost Items:</b>{" "}
          </h1>
          <p>
            If you experience a loss due to a software or network issue, you
            have 12 hours to report the issue to us by emailing
            JuicySkinsMOD@gmail.com or contacting our Discord support
            (JuicySkinsSupport). After this time, any lost items will be
            considered surrendered. We encourage you to withdraw your winnings
            as soon as possible to avoid any issues.
          </p>
          <br />
          <h1>
            <b>Content:</b>{" "}
          </h1>
          <p>
            The content of this website is for your general information and use
            only. It is subject to change without notice. We own the material on
            this website, including the design, layout, look, appearance and
            graphics. Reproduction is prohibited except in accordance with the
            copyright notice.
          </p>
          <br />
          <h1>
            {" "}
            <b>Affiliation :</b>{" "}
          </h1>
          <p>
            {" "}
            Juicyskins.com is not affiliated with Valve Corporation, Rust or any
            other trademarks of the Valve Corporation.
          </p>
        </Box>
      </Modal>
    </div>
  );
}
