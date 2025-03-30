import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../utilities/ContextManager";
import SquigglyText from "./squigglyText";

const LoadingCart = () => {
  const { userInfo } = useContext(ProductContext);
  const [cartLength, setCartLength] = useState(2);

  useEffect(() => {
    if (userInfo?.cart) setCartLength(userInfo.cart.length);
  }, [userInfo?.cart]);

  return (
    <ul>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item, index) => (
        <li
          key={index}
          className="list-none py-2 w-[20rem] sm:w-[25rem] lg:w-[30rem] mx-auto borderp-2"
        >
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div
                className="w-[6rem] h-[8rem] bg-gray-300 rounded-lg animate-pulseBg"
                style={{ animationDuration: 2 + 3 * Math.random() + "s" }}
              ></div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-row w-full justify-between">
                <h3 className="text-lg font-semibold w-24">
                  <SquigglyText
                    delay={2 + 3 * Math.random() + "s"}
                  ></SquigglyText>
                </h3>
                <div className="flex flex-row gap-4 text-textDark w-12">
                  <SquigglyText
                    delay={2 + 3 * Math.random() + "s"}
                  ></SquigglyText>
                </div>
              </div>
              <div className="capitalize text-gray-400 w-24">
                <SquigglyText
                  delay={2 + 3 * Math.random() + "s"}
                ></SquigglyText>
              </div>
              <div className="capitalize text-gray-600 w-[9rem]">
                <SquigglyText
                  delay={2 + 3 * Math.random() + "s"}
                ></SquigglyText>
              </div>
              <div className="uppercase text-gray-600 w-28">
                <SquigglyText
                  delay={2 + 3 * Math.random() + "s"}
                ></SquigglyText>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LoadingCart;
