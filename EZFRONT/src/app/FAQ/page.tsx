import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

export default function index() {
  return (
    <div className="w-full">
      <p className="text-5xl text-center my-10">FAQ</p>
      <div className="w-[80%] mx-auto">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            What is Juicyskins.com?
          </AccordionSummary>
          <AccordionDetails>
            Juicyskins.com is your go-to destination for digital items, skins,
            and accessories for your favorite video games. We offer a wide range
            of products to enhance your gaming experience.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            How does the Jackpot Game work?
          </AccordionSummary>
          <AccordionDetails>
            In the Jackpot Game, users contribute their items to a pool, and a
            winner is randomly selected to win the entire pool. The more
            valuable items you contribute, the higher your chances of winning.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            How do I play?
          </AccordionSummary>
          <AccordionDetails>
            To play the Jackpot Game, simply select the items you want to
            contribute to the pool and confirm your entry. Keep an eye on the
            jackpot size and your odds of winning.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            How do I set up my account to join the game?
          </AccordionSummary>
          <AccordionDetails>
            Setting up your account is quick and easy. Simply sign up with your
            email address, create a password, and you're ready to start browsing
            and playing.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5-content"
            id="panel5-header"
          >
            Why isn’t my inventory loading?
          </AccordionSummary>
          <AccordionDetails>
            If your inventory isn't loading, please ensure that you're logged
            into your account and that your internet connection is stable. If
            the issue persists, contact our support team for assistance.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6-content"
            id="panel6-header"
          >
            How do I accept my winnings?
          </AccordionSummary>
          <AccordionDetails>
            If you're the lucky winner of a Jackpot Game, your winnings will be
            automatically added to your account. You can then use them to
            purchase items or withdraw them as desired.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel7-content"
            id="panel7-header"
          >
            What are jackpot tickets?
          </AccordionSummary>
          <AccordionDetails>
            Jackpot tickets are virtual entries into the Jackpot Game. The more
            tickets you have, the greater your chances of winning. You can
            acquire tickets by purchasing them or by contributing items to the
            jackpot pool.
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
