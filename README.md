# 🔥 HypeShelf

**Collect and share the stuff you're hyped about.**

HypeShelf is a social recommendations platform where friends can share their favorite movies, shows, and content. Built with modern web technologies for a seamless, real-time experience.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat-square)
![Convex](https://img.shields.io/badge/Convex-Backend-orange?style=flat-square)

## ✨ Features

### Public Experience
- **Landing Page**: Beautiful, animated hero section with company branding
- **Latest Recommendations**: Real-time feed of the newest recommendations
- **Sign In**: Seamless Clerk authentication integration

### Authenticated Experience
- **Add Recommendations**: Share your favorites with title, genre, link, and blurb
- **Filter by Genre**: Quickly find recommendations by genre
- **Staff Picks**: Curated selections highlighted by admins
- **Real-time Updates**: Changes appear instantly via Convex

### Role-Based Access Control (RBAC)
- **Users**: Can create and delete their own recommendations
- **Admins**: Can delete any recommendation and toggle "Staff Pick" status

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Clerk** | Authentication & user management |
| **Convex** | Real-time database & backend functions |
| **Tailwind CSS 4** | Utility-first styling |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Clerk account ([sign up](https://dashboard.clerk.com))
- Convex account ([sign up](https://dashboard.convex.dev))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd hypeshelf
npm install
```

### 2. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**

### 3. Set Up Convex

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project
3. Copy your **Deployment URL**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

### 5. Run Development Servers

In two separate terminals:

**Terminal 1 - Convex Backend:**
```bash
npx convex dev
```

**Terminal 2 - Next.js Frontend:**
```bash
npm run dev:next
```

Or run both concurrently:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
hypeshelf/
├── convex/                    # Convex backend
│   ├── schema.ts             # Database schema
│   ├── recommendations.ts     # Recommendation mutations/queries
│   ├── users.ts              # User management functions
│   └── _generated/           # Auto-generated Convex files
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Public landing page
│   │   ├── globals.css       # Global styles & CSS variables
│   │   ├── providers.tsx     # Clerk + Convex providers
│   │   ├── dashboard/        # Protected dashboard route
│   │   ├── sign-in/          # Clerk sign-in page
│   │   └── sign-up/          # Clerk sign-up page
│   └── middleware.ts         # Route protection middleware
├── public/                    # Static assets
└── package.json
```

## 🔐 Security Considerations

### Authentication
- **Clerk Middleware**: Protects `/dashboard` routes server-side
- **Client-side checks**: Components respect signed-in state

### Authorization (RBAC)
- **Server-side validation**: All Convex mutations verify user roles
- **Owner checks**: Users can only modify their own recommendations
- **Admin privileges**: Stored in database, checked on every sensitive operation

### Best Practices Implemented
- ✅ User ID from Clerk passed to Convex (not from client state)
- ✅ Role verification happens server-side in Convex
- ✅ Input validation in mutations
- ✅ URL validation for links
- ✅ Character limits on blurbs

## 👤 Making a User an Admin

To make a user an admin, you'll need to directly update their role in Convex:

1. Sign in with the user account
2. Go to your [Convex Dashboard](https://dashboard.convex.dev)
3. Navigate to your project → Data → `users` table
4. Find the user by email or clerkId
5. Change `role` from `"user"` to `"admin"`

Alternatively, you can run this in the Convex dashboard's function runner:

```javascript
// In Convex dashboard → Functions → Run function
// Select users:updateUserRole and provide:
{
  "adminClerkId": "your_current_admin_clerk_id",
  "targetUserId": "target_user_id_from_users_table",
  "newRole": "admin"
}
```

## 🎨 Customization

### Themes
The app uses CSS variables for theming. Edit `src/app/globals.css`:

```css
:root {
  --accent-primary: #ff3366;    /* Main accent color */
  --accent-secondary: #00ccff;  /* Secondary accent */
  --accent-tertiary: #ffcc00;   /* Tertiary/warning */
}
```

### Genres
To add/modify genres, update:
1. `convex/schema.ts` - Add to the genre union type
2. `convex/recommendations.ts` - Update the genreValidator
3. `src/app/dashboard/page.tsx` - Add to genres array
4. `src/app/globals.css` - Add genre badge styling

## 📝 API Reference

### Queries

| Query | Description |
|-------|-------------|
| `recommendations.getLatestPublic` | Get latest recommendations (public) |
| `recommendations.getAll` | Get all with optional filters |
| `recommendations.getByUser` | Get user's recommendations |
| `users.getCurrentUser` | Get current user's profile |

### Mutations

| Mutation | Description | Auth Required |
|----------|-------------|---------------|
| `recommendations.create` | Add new recommendation | ✅ User |
| `recommendations.remove` | Delete recommendation | ✅ Owner/Admin |
| `recommendations.toggleStaffPick` | Toggle staff pick | ✅ Admin only |
| `users.getOrCreateUser` | Sync Clerk user to Convex | ✅ User |
| `users.updateUserRole` | Change user role | ✅ Admin only |

## 🐛 Troubleshooting

### "User not found" error
Make sure the user has signed in at least once so they're synced to Convex.

### Convex connection issues
Verify your `NEXT_PUBLIC_CONVEX_URL` is correct in `.env.local`.

### Clerk redirect issues
Check that all `NEXT_PUBLIC_CLERK_*` URLs are set correctly.

## 📄 License

MIT © 2026 HypeShelf

---

Built with ❤️ using Next.js, Clerk, and Convex
