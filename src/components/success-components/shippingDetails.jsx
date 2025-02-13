const ShippingDetails = ({ orderData }) => {
  return (
    <div className="flex flex-col">
      <h2 className="font-medium text-base lg:text-lg">Shipping Address</h2>{" "}
      <p className="">{orderData.shippingInfo.name}</p>
      <p className="">{orderData.shippingInfo.address.line1}</p>
      <div className="flex flex-row gap-1">
        <p className="">{orderData.shippingInfo.address.city},</p>
        <p className="">{orderData.shippingInfo.address.state}</p>
      </div>
      <p className="">{orderData.shippingInfo.address.country}</p>
    </div>
  );
};

export default ShippingDetails;
