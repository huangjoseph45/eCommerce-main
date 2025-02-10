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
      {userInfo?.cart &&
        userInfo.cart.length > 0 &&
        userInfo.cart.map((item, index) => (
          <li key={index} className="list-none py-2">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <div
                  className="w-32 h-48 bg-gray-300 rounded-lg animate-pulseBg"
                  style={{ animationDuration: 2 + 3 * Math.random() + "s" }}
                ></div>
                <SquigglyText
                  delay={2 + 3 * Math.random() + "s"}
                ></SquigglyText>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row w-full justify-between">
                  <h3 className="text-lg font-semibold w-32">
                    <SquigglyText
                      delay={2 + 3 * Math.random() + "s"}
                    ></SquigglyText>
                  </h3>
                  <div className="flex flex-row gap-4">
                    <p className="text-textDark w-24">
                      <SquigglyText
                        delay={2 + 3 * Math.random() + "s"}
                      ></SquigglyText>
                    </p>
                  </div>
                </div>
                <p className="capitalize text-gray-400 w-24">
                  <SquigglyText
                    delay={2 + 3 * Math.random() + "s"}
                  ></SquigglyText>
                </p>
                <p className="capitalize text-gray-600 w-[9rem]">
                  <SquigglyText
                    delay={2 + 3 * Math.random() + "s"}
                  ></SquigglyText>
                </p>
                <p className="uppercase text-gray-600 w-28">
                  <SquigglyText
                    delay={2 + 3 * Math.random() + "s"}
                  ></SquigglyText>
                </p>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default LoadingCart;
