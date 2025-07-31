# KERVENTZ STATUS - Professional Contact Management System

A dual-site professional contact management platform with public registration and secure admin dashboard.

## 🌟 Features

### Public Site
- **Multi-language Support**: French, English, Spanish with real-time switching
- **Professional Registration Form**: Phone validation, suffix selection, email confirmation
- **Real-time Statistics**: Live counters and engagement metrics
- **Premium UI/UX**: Glassmorphism effects, dark/light themes, smooth animations
- **WhatsApp Integration**: Direct group access with professional branding
- **Testimonials & FAQ**: Professional content sections with interactive elements
- **Mobile Responsive**: Optimized for all devices

### Admin Dashboard
- **Secure Authentication**: Session-based login with 24h expiration
- **Contact Management**: Full CRUD operations with search and filtering
- **Export Functionality**: VCF and CSV export with professional formatting
- **Suffix Management**: Dynamic suffix system with real-time updates
- **Analytics Dashboard**: Statistics and insights with data visualization
- **Professional Interface**: Executive-level design with comprehensive controls

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use in-memory storage for development)
- npm or yarn package manager

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd kerventz-status
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database and configuration details
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Public Site: `http://localhost:5000`
   - Admin Dashboard: `http://localhost:5000/admin`
   - Admin Credentials: `admin` / `kerventz2025`

## 📁 Project Structure

