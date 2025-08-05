# Taskify - Trello Clone

A modern Trello clone built with Next.js 14, TypeScript, Tailwind CSS, and Clerk authentication.

## Features

✅ **Authentication & Authorization**
- Secure authentication with Clerk
- Protected routes and user sessions

✅ **Board Management**
- Create, view, and manage boards
- Beautiful board cards with customizable backgrounds

✅ **List Management**
- Create lists within boards
- Organize lists with proper ordering

✅ **Card Management**
- Add cards to lists
- Proper card ordering within lists
- Clean and intuitive card interface

✅ **Modern UI/UX**
- Responsive design with Tailwind CSS
- Clean and modern interface
- Smooth transitions and hover effects

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Clerk
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd taskify
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory and add:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/taskify_db?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/protected
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/protected
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
├── (marketing)/          # Landing page
├── (platform)/          # Main application
│   ├── _components/      # Platform-wide components
│   ├── (clerk)/         # Authentication pages
│   ├── protected/       # Dashboard and boards
│   └── board/[boardId]/ # Individual board pages
components/
├── ui/                  # Reusable UI components
└── logo.tsx            # Logo component
lib/
├── db.ts               # Database connection
└── utils.ts            # Utility functions
prisma/
└── schema.prisma       # Database schema
```

## Future Enhancements

🔄 **In Progress**
- Drag and drop functionality for cards and lists
- Enhanced styling and animations

🚀 **Planned Features**
- Card descriptions and due dates
- Board collaboration and sharing
- Activity logs and notifications
- File attachments
- Labels and filters
- Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
