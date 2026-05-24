# WFH Attendance Monitoring System - Frontend

A modern Next.js frontend application for managing work-from-home employee attendance with photo check-in functionality.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Ant Design (antd)
- **HTTP Client**: Axios
- **Authentication**: JWT (localStorage-based)

## Features

### 1. Authentication

- **Login Page** (`/login`)
  - Email and password authentication
  - POST request to `/auth/login`
  - Token and user data stored in localStorage
  - Role-based redirect (ADMIN → `/admin/employees`, EMPLOYEE → `/employee/check-in`)

### 2. Admin Dashboard

#### Employees Management (`/admin/employees`)

- View all employees in a table
- Create new employee with form
- Edit existing employee details
- Delete employee records
- Protected route (ADMIN only)

#### Attendance Records (`/admin/attendances`)

- View all check-in records in a table
- Display columns: employee name, code, department, position, date, check-in time, note, photo
- View employee photos in modal
- Protected route (ADMIN only)

### 3. Employee Dashboard

#### Check-in Page (`/employee/check-in`)

- Upload photo (required)
- Add optional note
- Submit multipart/form-data to POST `/attendances/check-in`
- Success/error message feedback
- Protected route (EMPLOYEE only)

#### Attendance History (`/employee/history`)

- View personal attendance records
- Display columns: date, check-in time, note, photo
- View check-in photos
- Protected route (EMPLOYEE only)

## Project Structure

```
wfh-attendance-monitoring-next-web/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with ConfigProvider
│   ├── page.tsx                 # Home page (redirects to dashboard/login)
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── admin/
│   │   ├── employees/
│   │   │   └── page.tsx        # Admin employees list
│   │   └── attendances/
│   │       └── page.tsx        # Admin attendances view
│   └── employee/
│       ├── check-in/
│       │   └── page.tsx        # Employee check-in
│       └── history/
│           └── page.tsx        # Employee attendance history
├── components/
│   ├── Layout.tsx              # Main layout with sidebar/header
│   └── ProtectedRoute.tsx       # Route protection wrapper
├── lib/
│   ├── api.ts                  # Axios instance with interceptors
│   └── auth.ts                 # Auth helper functions
├── .env.local                  # Environment variables
├── .env.example                # Environment template
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:

- `axios` - HTTP client
- `antd` - UI components
- `@ant-design/icons` - Icon library
- Other Next.js and React dependencies

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Or copy from `.env.example`:

```bash
cp .env.example .env.local
```

Update the `NEXT_PUBLIC_API_URL` to match your backend API server address.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## API Integration

### Authentication Flow

1. User submits login form with email and password
2. POST `/auth/login` returns `accessToken` and `user` object
3. Token and user stored in localStorage
4. Authorization header automatically added to all API requests: `Authorization: Bearer {token}`

### API Endpoints

**Authentication:**

- `POST /auth/login` - Login with email/password

**Admin Endpoints:**

- `GET /employees` - List all employees
- `POST /employees` - Create new employee
- `PATCH /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee
- `GET /attendances` - List all attendance records

**Employee Endpoints:**

- `POST /attendances/check-in` - Submit check-in with photo
- `GET /attendances/my` - Get personal attendance history

## Key Features

### Axios Instance (`lib/api.ts`)

- Automatic Bearer token injection from localStorage
- Error handling with 401 redirect to login
- Based URL from environment variable

### Auth Helpers (`lib/auth.ts`)

- `getToken()` - Retrieve stored access token
- `getUser()` - Retrieve stored user object
- `setAuth()` - Save token and user
- `logout()` - Clear auth and redirect to login
- `isAuthenticated()` - Check if user is logged in
- `isAdmin()` - Check if user has ADMIN role
- `isEmployee()` - Check if user has EMPLOYEE role

### Protected Route Component (`components/ProtectedRoute.tsx`)

- Wraps pages requiring authentication
- Validates token and user existence
- Enforces role-based access (ADMIN or EMPLOYEE)
- Redirects to login if not authenticated

### Layout Component (`components/Layout.tsx`)

- Responsive sidebar/header navigation
- Desktop and mobile menu support
- Role-based menu items (ADMIN vs EMPLOYEE)
- User name display
- Logout button

## Form Submissions

### Login Form

- Email validation (required, valid format)
- Password validation (required)
- Loading state during submission

### Employee Form (Admin)

- Name, email, password, employee code, department, position
- Email validation
- Default password: "password123" if not provided on create

### Check-in Form (Employee)

- Photo upload (required, image only)
- Optional note
- Multipart/form-data submission

## Styling

- **Tailwind CSS** for utility styles
- **Ant Design** for pre-built components and theming
- Responsive design with mobile-first approach
- Clean, professional UI with good spacing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Error Handling

- API errors display as error messages
- 401 (Unauthorized) automatically redirects to login
- Network errors shown to user
- Loading states prevent multiple submissions

## Testing Credentials

Use these credentials to test the login (ensure backend is running with this test data):

**Admin User:**

- Email: admin@example.com
- Password: password123

**Employee User:**

- Email: employee@example.com
- Password: password123

## Development Notes

- All pages use `'use client'` directive (Client Components)
- ProtectedRoute wrapper is required for non-login pages
- localStorage is used for persistence (suitable for SPA)
- Axios interceptors handle auth automatically
- Redirect-based route protection
- Image display from API using full URL

## Troubleshooting

### Build Errors

- Ensure all required dependencies are installed: `npm install`
- Check that `.env.local` exists with correct API URL
- Clear `.next` folder: `rm -rf .next` and rebuild

### 401 Unauthorized Errors

- Token may have expired
- Check if backend is running
- Verify API URL in `.env.local`

### Photo Upload Issues

- Check file size limits
- Ensure file is in image format
- Verify multipart/form-data is being sent

## Next Steps

1. Start backend API server on port 3001
2. Run development server: `npm run dev`
3. Navigate to http://localhost:3000
4. Login with test credentials
5. Test features in admin/employee dashboards

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
