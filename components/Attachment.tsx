import supabase from "lib/supabase";
import { useEffect, useState } from "react";

const Attachment = ({ modelName, modelId }) => {
  const [items, setItems] = useState([]);
  console.log("items: ", items);

  useEffect(() => {
    console.log("supabase: ", supabase);
    const fetchAttachemnts = async () => {
      const { data } = await supabase
        .from("attachment")
        .select()
        .eq("modelId", modelId)
        .eq("modelName", modelName);

      setItems(data);
    };

    fetchAttachemnts();
  }, [modelName, modelId]);

  return null;
};

export default Attachment;
