import { useState } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import Announcement from "../models/Announcement";
import {connectDB} from "../mongo.server"
import { authenticate } from "../shopify.server";

import { Form, useLoaderData } from "react-router";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  await connectDB();

  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean(); 

  return { announcements };
};
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
  
  const { announcements } = useLoaderData();
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

      {/* Recent Announcements List */}
      

      {/* Text Input */}
      <input
        name="announcement"
        type="text"
        placeholder="Write your announcement..."
        value={announcement}
        onChange={(e) => { setAnnouncement(e.target.value); setSaved(false); }}
        style={{
          padding: "9px 13px",
          fontSize: "13px",
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

      {/* Preview */}
      <div
        style={{
          maxWidth: "480px",
          padding: "9px 13px",
          background: announcement.trim() ? "#121212" : "#f5f5f3",
          border: announcement.trim() ? "none" : "1px dashed #d1d1d1",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "background 0.2s",
          minHeight: "38px",
        }}
      >
        {announcement.trim() ? (
          <>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.5, flexShrink: 0 }} />
            <span style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
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

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="submit"
          disabled={saving || !announcement.trim()}
          style={{
            width: "fit-content",
            padding: "9px 18px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#fff",
            background: saving ? "#555" : "#121212",
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "wait" : "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s",
            opacity: !announcement.trim() ? 0.35 : 1,
          }}
        >
          {saving ? "Publishing..." : "Publish announcement"}
        </button>

        {saved && !announcement.trim() && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#16a34a",
            fontWeight: 500,
          }}>
            <div style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#16a34a",
              animation: "pulse 2s infinite",
            }} />
            Live on your site
            <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>
          </div>
        )}
        
      </div>
      

    </Form>
     <div
        style={{
          maxWidth: "480px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#fff",
          marginTop:"15px",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid #efefef",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#1a1a1a",
            background: "#fafafa",
          }}
        >
          Recent Announcements
        </div>
 
        {announcements.length === 0 ? (
          <div
            style={{
              padding: "16px 14px",
              color: "#aaa",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            No announcements yet.
          </div>
        ) : (
          announcements.map((item, i) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "11px 14px",
                borderBottom: i < announcements.length - 1 ? "1px solid #f1f1f1" : "none",
              }}
            >
              <div
                style={{
                  marginTop: "5px",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#121212",
                  opacity: 0.3,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#121212",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {item.text}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    marginTop: "3px",
                  }}
                >
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
  </s-section>
</s-page>
);
    

}


export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
