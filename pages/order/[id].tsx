import { useRouter } from "next/router";
import Reivew from "./Review";
import Create from "./Create";

function OrderPage() {
  const router = useRouter();
  const { id } = router.query;

  if (id === "new") {
    return <Create />;
  }

  return <Reivew />;
}

export default OrderPage;
