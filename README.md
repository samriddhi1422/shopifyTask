# Announcement Banner App

A Shopify Embedded App that allows merchants to create and publish announcement banners directly from the Shopify Admin. The published announcement is stored in MongoDB, synchronized with Shopify Metafields, and displayed on the storefront using a Theme App Extension.

---

## Features

- Create and publish announcements
- Live announcement preview
- Store announcement history in MongoDB
- Sync announcements with Shopify Metafields
- Display announcement banner on the storefront using a Theme App Extension
- View recently published announcements

---

## Tech Stack

- React Router
- Shopify App Bridge
- Shopify Admin GraphQL API
- MongoDB
- PostgreSQL (Prisma Session Storage)
- Prisma ORM
- Shopify Theme App Extension

---

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or later)
- npm
- Shopify CLI
- Shopify Partner Account
- Shopify Development Store
- MongoDB Database
- PostgreSQL Database

---

## Environment Variables

Create a `.env` file in the project root and add the following:

```env
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=your_app_url

SCOPES=write_products,write_metaobjects,write_metaobject_definitions

DATABASE_URL=your_postgresql_database_url
MONGODB_URI=your_mongodb_connection_string
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/samriddhi1422/shopifyTask.git
cd announcement-banner-app
```

### Install dependencies

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Apply Prisma Migrations

```bash
npx prisma migrate deploy
```

### Start the Development Server

```bash
shopify app dev
```

---

## Project Structure

```
announcement-banner-app
│
├── app/
│   ├── models/
│   ├── routes/
│   ├── db.server.js
│   ├── mongo.server.js
│   └── shopify.server.js
│
├── extensions/
│   └── announcement-banner/
│
├── prisma/
│
├── package.json
└── README.md
```

---

## How It Works

1. Merchant enters an announcement.
2. A live preview is displayed.
3. Clicking **Publish Announcement**:
   - Saves the announcement in MongoDB.
   - Updates a Shopify Metafield.
4. The Theme App Extension reads the latest metafield value.
5. The announcement banner is displayed on the storefront.
6. Recent announcements are shown in the admin dashboard.

---

## Future Improvements

- Edit existing announcements
- Delete announcements
- Schedule announcements
- Multiple active announcements
- Announcement expiry
- Rich text support

---

## Author

**Samriddhi Shrivastava**
