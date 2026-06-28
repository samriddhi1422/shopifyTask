import { useState } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import Announcement from "../models/Announcement";
import {connectDB} from "../mongo.server"
import { authenticate } from "../shopify.server";

import { Form } from "react-router";
export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

  await connectDB();

  const formData = await request.formData();

  const announcement = formData.get("announcement");

  await Announcement.create({
    text: announcement,
  });

  console.log(" Saved:", announcement);

  const shopResponse = await admin.graphql(`
  {
    shop {
      id
    }
  }
`);

const shopData = await shopResponse.json();
const shopId = shopData.data.shop.id;

const metafieldResponse = await admin.graphql(
  `#graphql
  mutation SetAnnouncement($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }`,
  {
    variables: {
      metafields: [
        {
          ownerId: shopId,
          namespace: "my_app",
          key: "announcement",
          type: "single_line_text_field",
          value: announcement,
        },
      ],
    },
  }
);

const metafieldData = await metafieldResponse.json();

console.log("Metafield Response:", JSON.stringify(metafieldData, null, 2));

  return null;
};
 
export default function Index() {
  
  const [announcement, setAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);
 const [saved, setSaved] = useState(false);

 const handleSubmit = (e) => {
  setSaving(true);
  setSaved(false);
  setTimeout(() => {
    setSaving(false);
    setSaved(true);
      setAnnouncement("");
  }, 1200);
};


    return (
  <s-page heading="Announcement Manager">
  <s-section heading="Create Announcement">
    <Form
      method="POST"
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <input
        name="announcement"
        type="text"
        placeholder="Enter announcement..."
        value={announcement}
        onChange={(e) => { setAnnouncement(e.target.value); setSaved(false); }}
        style={{
          padding: "10px 14px",
          fontSize: "14px",
          width: "100%",
          maxWidth: "480px",
          border: "1px solid #d1d1d1",
          borderRadius: "8px",
          outline: "none",
          fontFamily: "inherit",
          color: "#121212",
          background: "#fff",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#121212";
          e.target.style.boxShadow = "0 0 0 3px rgba(18,18,18,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d1d1d1";
          e.target.style.boxShadow = "none";
        }}
      />

      <div
        style={{
          maxWidth: "480px",
          padding: "10px 16px",
          background: announcement.trim() ? "#121212" : "#f5f5f3",
          border: announcement.trim() ? "none" : "1px dashed #d1d1d1",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "background 0.2s",
          minHeight: "42px",
        }}
      >
        {announcement.trim() ? (
          <>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.6, flexShrink: 0 }} />
            <span style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "#fff",
            }}>
              {announcement}
            </span>
          </>
        ) : (
          <span style={{ fontSize: "12px", color: "#aaa", fontStyle: "italic" }}>
            Preview will appear here...
          </span>
        )}
      </div>

    <button
  type="submit"
  disabled={saving || !announcement.trim()}
  style={{
    width: "fit-content",
    padding: "10px 20px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#fff",
    background: saving ? "#555" : "#121212",
    border: "none",
    borderRadius: "8px",
    cursor: saving ? "wait" : "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
    opacity: !announcement.trim() ? 0.4 : 1,
  }}
>
  {saving ? " Publishing..." : "Publish Announcement"}
</button>

{saved && !announcement.trim() && (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#16a34a",
    fontWeight: 500,
  }}>
    <div style={{
      width: 8, height: 8, borderRadius: "50%",
      background: "#16a34a",
      animation: "pulse 2s infinite",
    }} />
    Your banner is live on your site
    <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>
  </div>
)}

    </Form>
  </s-section>
</s-page>
);
    

}


export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
