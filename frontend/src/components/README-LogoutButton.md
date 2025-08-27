# LogoutButton Component

A standalone, reusable logout button component for React applications with Tailwind CSS styling.

## Features

- ✅ **Automatic Logout**: Clears all authentication data from localStorage
- ✅ **Smart Redirect**: Redirects to `/login` page after logout
- ✅ **Toast Notifications**: Shows success/error messages using react-hot-toast
- ✅ **Multiple Variants**: 5 different visual styles
- ✅ **Multiple Sizes**: 4 different size options
- ✅ **Customizable**: Accepts custom className and children
- ✅ **Accessibility**: Proper ARIA labels and keyboard support
- ✅ **Error Handling**: Graceful error handling with user feedback

## Installation

The component is already included in your project at `src/components/LogoutButton.jsx`.

## Basic Usage

```jsx
import LogoutButton from '@/components/LogoutButton';

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <h1 className="text-xl font-bold">RentEasy</h1>
      <LogoutButton />
    </nav>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `''` | Additional CSS classes |
| `variant` | string | `'default'` | Visual style variant |
| `size` | string | `'md'` | Button size |
| `children` | ReactNode | `'Logout'` | Button text content |
| `onLogout` | function | `undefined` | Custom logout callback |

## Variants

### 1. Default
```jsx
<LogoutButton variant="default" />
```
- Red background with white text
- Hover effect with darker red
- Shadow effects

### 2. Outline
```jsx
<LogoutButton variant="outline" />
```
- Red border with red text
- Hover effect fills with red background
- Clean, minimal appearance

### 3. Ghost
```jsx
<LogoutButton variant="ghost" />
```
- Red text only
- Hover effect with light red background
- Subtle, unobtrusive

### 4. Danger
```jsx
<LogoutButton variant="danger" />
```
- Darker red background
- More prominent warning appearance
- Strong visual emphasis

### 5. Subtle
```jsx
<LogoutButton variant="subtle" />
```
- Light red background with red text
- Very gentle appearance
- Good for secondary actions

## Sizes

### Small
```jsx
<LogoutButton size="sm" />
```
- Compact button
- Good for tight spaces

### Medium (Default)
```jsx
<LogoutButton size="md" />
```
- Standard button size
- Balanced proportions

### Large
```jsx
<LogoutButton size="lg" />
```
- Prominent button
- Good for primary actions

### Extra Large
```jsx
<LogoutButton size="xl" />
```
- Very prominent button
- Good for hero sections

## Customization Examples

### Custom Styling
```jsx
<LogoutButton 
  className="bg-purple-600 hover:bg-purple-700 text-white border-0"
  size="lg"
>
  Custom Purple Logout
</LogoutButton>
```

### Custom Callback
```jsx
<LogoutButton 
  variant="outline"
  onLogout={() => {
    console.log('Custom logout logic!');
    // Additional cleanup or analytics
  }}
>
  Logout with Callback
</LogoutButton>
```

### Custom Text
```jsx
<LogoutButton variant="ghost">
  Sign Out
</LogoutButton>
```

## What Happens on Logout

1. **Clears localStorage**:
   - `access_token`
   - `refresh_token`
   - `user_role`
   - `username`

2. **Calls compatibility functions**:
   - `window.clearToken()` if available

3. **Shows success message**:
   - Toast notification: "👋 Logged out successfully"

4. **Executes custom callback**:
   - If `onLogout` prop is provided

5. **Redirects user**:
   - Navigates to `/login` page

## Error Handling

The component includes comprehensive error handling:
- Try-catch wrapper around logout logic
- Console logging for debugging
- User-friendly error messages
- Graceful fallback behavior

## Accessibility

- **ARIA Label**: `aria-label="Logout"`
- **Keyboard Support**: Focusable with Tab key
- **Focus Ring**: Visible focus indicator
- **Screen Reader**: Proper semantic structure

## Dependencies

- `react` - Core React library
- `react-router-dom` - For navigation
- `react-hot-toast` - For notifications
- `tailwindcss` - For styling

## Browser Compatibility

- Modern browsers (ES6+)
- React 16.8+ (hooks support)
- Tailwind CSS 2.0+

## Example Integration

```jsx
import React from 'react';
import LogoutButton from '@/components/LogoutButton';

function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Welcome back!
            </span>
            <LogoutButton 
              variant="outline" 
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
```

## Troubleshooting

### Button not appearing
- Check if component is properly imported
- Verify Tailwind CSS is loaded
- Check browser console for errors

### Logout not working
- Ensure `react-router-dom` is properly configured
- Check if localStorage is accessible
- Verify toast notifications are working

### Styling issues
- Confirm Tailwind CSS is properly configured
- Check for CSS conflicts
- Verify className props are being applied
