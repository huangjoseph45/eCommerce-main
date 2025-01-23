import { useContext } from "react";
import { ProductContext } from "../components/utilities/ProductContext";

const ProfilePage = () => {
  const { userInfo } = useContext(ProductContext);
  return (
    <>
      <p>First Name: {userInfo?.firstName}</p>
      <p>Last Name: {userInfo?.lastName}</p>
      <p>Email: {userInfo?.email}</p>
      <p>Address: {userInfo?.address}</p>
      <p>Age: {userInfo?.age}</p>
      <p>Account Created: {userInfo?.creationDate}</p>
    </>
  );
};

export default ProfilePage;
