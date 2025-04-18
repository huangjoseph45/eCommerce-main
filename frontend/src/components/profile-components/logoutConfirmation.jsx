import { createPortal } from "react-dom";
import useSideBarToggle from "../utilities/sideBarToggles";
import useLogout from "../utilities/useLogout";
import Button from "../button";
import { motion, AnimatePresence } from "motion/react";

const LogoutConfirmation = ({ showModal, setShowModal }) => {
  const [loading, result, tryLogout] = useLogout();

  useSideBarToggle({ setShowSidebar: setShowModal, showSidebar: showModal });

  return createPortal(
    <AnimatePresence>
      {showModal && (
        <div className="absolute top-0 left-0 z-[40] w-full h-full ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-bgSecondary/15 w-full h-full absolute "
            onClick={() => setShowModal(false)}
          ></motion.div>
          <motion.div
            className="p-4 rounded-md absolute top-[40%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[20rem]  border bg-bgBase3"
            initial={{
              scale: 0.3,
              translateX: "-50%",
              translateY: "-30%",
              opacity: 0,
            }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <h1 className="text-center p-2 text-xl ">Log Out?</h1>
            <p className="text-textHollow text-sm mb-4 w-fit mx-auto">
              Are you sure you want to logout?
            </p>
            {!loading ? (
              <div className="flex flex-row gap-2">
                <Button
                  invert={true}
                  buttonText={"Yes, log out"}
                  large={false}
                  buttonFunc={tryLogout}
                />
                <Button
                  buttonText={"Cancel"}
                  large={false}
                  buttonFunc={() => setShowModal(false)}
                />
              </div>
            ) : (
              <div className="mx-auto loader size-8"></div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LogoutConfirmation;

// {loading ? (
//     <div className="loader size-8"></div>
//   ) :
